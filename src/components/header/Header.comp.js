import React from 'react';
import './header.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({room, name, view, navBack, toggleMenu, typing, usersInRoom, location}) => {

    return location.pathname === '/chat' ? (  
        <div className="header">
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
            <div className="headerInfo">
                <h2>{room}</h2>
                <div className="usersInRoom">You{usersInRoom.map((user, i) => 
                    user.name !== name && <span key={i}>{', ' + user.name}</span>
                )}</div>
            </div>
            <div className="typingInfo">{typing}</div>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
        </div>
    ):(
        <div className="header">
            {location.pathname === '/' ? (
               <div className="backLink noPointer"/>
            ):(
                <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
                
            )}
            {location.pathname === '/rooms' ? <h2>{name}</h2> : <h2>L.I.T Chat</h2>}
            
            {/* {!name && <h2></h2>} */}
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
        </div>
    )
    
}

export default Header;