import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({room, name, view, navBack}) => {

    return view === 'chat' ? (  
        <div className="statusBar">
            <h2>{name} in {room}</h2>
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>navBack()}/>
        </div>
    ):(
        <div className="statusBar">
            <h2>LIT Chat</h2>
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>navBack()}/>
        </div>
    )
    
}

export default Header;