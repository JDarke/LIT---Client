import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
const Header = ({room, name, view, leaveRoom}) => {

    return view === 'signin' ? (
        <div className="statusBar">
            <h2>LIT Chat - Login</h2>
        </div>
    ):(
        <div className="statusBar">
            <h2>{name} in {room}</h2>
            
            <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>leaveRoom()}/>
            <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>leaveRoom()}/>
            {/* <div className="backLink" onClick={()=>leaveRoom()}>{`<`}</div> */}
        </div>  
    )
    
}

export default Header;