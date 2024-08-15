import { useEffect, useState, useRef } from 'react';
import { socketService, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_SET_TOPIC, SOCKET_EVENT_USER_TYPING, SOCKET_EMIT_USER_TYPING } from '../services/socket.service.js';
import { userService } from '../services/user.service.js';
import { showErrorMsg } from '../services/event-bus.service.js';

export function ChatRoom({ toyId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [typingUser, setTypingUser] = useState(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        async function loadLoggedInUser() {
            try {
                const user = await userService.getLoggedInUser();
                if (user) {
                    setLoggedInUser(user);
                    console.log('Logged in user loaded:', user);
                } else {
                    showErrorMsg('Failed to load user, please log in.');
                }
            } catch (err) {
                console.error('Failed to fetch logged-in user', err);
                showErrorMsg('Failed to load user, please log in.');
            }
        }

        loadLoggedInUser();
    }, []);

    useEffect(() => {
        if (!loggedInUser) return;

        socketService.emit(SOCKET_EMIT_SET_TOPIC, toyId);
        console.log('Joined room:', toyId);

        socketService.on(SOCKET_EVENT_ADD_MSG, (message) => {
            console.log('Message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketService.on(SOCKET_EVENT_USER_TYPING, (username) => {
            setTypingUser(username);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000); // Clear typing status after 2 seconds
        });

        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG);
            socketService.off(SOCKET_EVENT_USER_TYPING);
            socketService.emit('leave-room', toyId);
            console.log('Left room:', toyId);
        };
    }, [toyId, loggedInUser]);

    function handleSendMessage() {
        if (!newMessage.trim()) return;
        if (!loggedInUser) {
            showErrorMsg('You must be logged in to send a message');
            return;
        }

        const message = {
            txt: newMessage,
            by: loggedInUser.fullname,
            toyId,
        };

        console.log('Sending message:', message);
        socketService.emit(SOCKET_EMIT_SEND_MSG, message);
        setNewMessage('');
        setTypingUser(null);
    }

    function handleTyping(e) {
        setNewMessage(e.target.value);

        if (!loggedInUser) return;

        socketService.emit(SOCKET_EMIT_USER_TYPING, loggedInUser.fullname);
    }

    return (
        <div className="chat-room">
            <h2>Chat about this toy</h2>
            <div className="messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className="message">
                        <strong>{msg.by}</strong>: {msg.txt}
                    </div>
                ))}
            </div>
            {typingUser && (
                <div className="typing-status">
                    <em>{typingUser} is typing...</em>
                </div>
            )}
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}
