import { useEffect, useState } from 'react';
import { socketService } from '../services/socket.service.js';
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
        // Join the specific chat room for the toy
        socketService.emit('join-room', toyId);

        // Listen for incoming messages
        socketService.on('message-received', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the effect when the component unmounts
        return () => {
            socketService.off('message-received');
            socketService.emit('leave-room', toyId);
        };
    }, [toyId]);

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
        socketService.emit('send-message', message);

        // Optionally add the message to the UI instantly (optimistic UI)
        setMessages((prevMessages) => [...prevMessages, message]);
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
