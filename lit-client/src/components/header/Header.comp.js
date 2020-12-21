import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({room, name, view, navBack, toggleMenu}) => {

    return view === 'chat' ? (  
        <div className="statusBar">
            
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
            <h2>{room}</h2>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
        </div>
    ):(
        <div className="statusBar">
            
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
            <h2>LIT Chat</h2>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
        </div>
    )
    
}

export default Header;