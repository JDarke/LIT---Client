
import React from 'react';


const ChatWindow = ({ messages, messagesEndRef, typeText, handleChange, sendMessage, name }) => {
    return (
        <>
            <ul id="messages">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.userName === name ? 'message message-user' : "message"}>
                        <li className={msg.userName}>{msg.text}</li>
                        <div className="timeStamp">{msg.time}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ul>
            <form className="messageForm" action="" onSubmit={(e) => e.preventDefault()}>
                <input id="m" autoComplete="off" value={typeText} onChange={(e) => handleChange(e, 'typeText')} />
                <button onClick={() => sendMessage(typeText)}>Send</button>
            </form>
        </>
    )
}

export default ChatWindow;
