import React from 'react';
import './header.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({room, name, view, navBack, toggleMenu, typing, usersInRoom}) => {

    return view === 'chat' ? (  
        <div className="header">
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
            <h2>{usersInRoom.map(user => <span>{user.name}</span>)}</h2>
            <div className="typingInfo">{typing}</div>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
        </div>
    ):(
        <div className="header">
            {view === 'home' ? (
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