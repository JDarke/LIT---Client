import React from 'react';
import './footer.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Footer = ({ view, typeText, handleChange, sendMessage, location }) => {

    return (
        <div className="footer">
            {location.pathname ==='/chat' && (
                <form className="messageForm" action="" onSubmit={(e) => e.preventDefault()}>
                    <input placeholder="Type a message" id="m" autoComplete="off" value={typeText} onChange={(e) => handleChange(e, 'typeText')} />
                    <button onClick={() => sendMessage(typeText)}><FontAwesomeIcon className="send" icon={faPlay}/></button>
                </form>
            )}
        </div>
    )    
}

export default Footer;
