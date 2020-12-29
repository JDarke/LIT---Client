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
                <div className="usersInRoom">{usersInRoom.map((user, i) => 
                    <span>{user.name}{i !== (usersInRoom.length - 1) && ', ' }</span>
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
            <h2>LIT Chat</h2>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
        </div>
    )
    
}

export default Header;