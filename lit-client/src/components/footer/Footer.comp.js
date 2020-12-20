import React from 'react';

const Footer = ({ view, typeText, handleChange, sendMessage }) => {

    return (
        <div className="footer">
            {view ==='chat' && (
                <form className="messageForm" action="" onSubmit={(e) => e.preventDefault()}>
                    <input placeholder="Type a message" id="m" autoComplete="off" value={typeText} onChange={(e) => handleChange(e, 'typeText')} />
                    <button onClick={() => sendMessage(typeText)}>Send</button>
                </form>
            )}
        </div>
    )    
}

export default Footer;
