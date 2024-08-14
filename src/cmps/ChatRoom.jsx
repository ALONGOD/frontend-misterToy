import { useEffect, useState } from 'react';
import { socketService, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_SET_TOPIC } from '../services/socket.service.js';
import { userService } from '../services/user.service.js';
import { showErrorMsg } from '../services/event-bus.service.js';

export function ChatRoom({ toyId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        // Fetch the logged-in user
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

        // Join the specific chat room for the toy
        socketService.emit(SOCKET_EMIT_SET_TOPIC, toyId);
        console.log('Joined room:', toyId);

        // Listen for incoming messages
        socketService.on(SOCKET_EVENT_ADD_MSG, (message) => {
            console.log('Message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the effect when the component unmounts
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG);
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

        // Emit the message to the server
        console.log('Sending message:', message);
        socketService.emit(SOCKET_EMIT_SEND_MSG, message);

        // Clear the input field after sending the message
        setNewMessage('');
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
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}
