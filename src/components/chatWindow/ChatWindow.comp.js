import React from 'react';

const ChatWindow = ({ messages, messagesEndRef, name, room, usersInRoom}) => {
    
    return (
            <ul id="messages">
                {messages.map((msg, i) => (
                     msg.room === room &&
                    (<li key={i} className={msg.userName === name ? 'message message-user' : msg.userName === 'admin' ? 'message message-admin' : "message "   }>
                        {(msg.userName !== name && msg.userName !== 'admin' && msg.userName !== messages[i-1].userName) && <div className="messageName">{msg.userName}</div>}
                        <div className="messageText">
                            {msg.text}
                            <div className="timeStamp">{msg.time}</div>
                        </div>
                        
                    </li>)
                    
                ))}
                {/* <div className="typing">{typing}</div> */}
                <div ref={messagesEndRef} />
            </ul>    
    )
}

export default ChatWindow;
