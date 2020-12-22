import React from 'react';

const ChatWindow = ({ messages, messagesEndRef, name }) => {
    return (
            <ul id="messages">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.userName === name ? 'message message-user' : msg.userName === 'admin' ? 'message message-admin' : "message"}>
                        <li className={msg.userName}>{msg.text}</li>
                        <div className="timeStamp">{msg.time}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ul>
            
    )
}

export default ChatWindow;
