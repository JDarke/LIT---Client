import React from 'react';
import './header.scss';
import litlogowhite from '../../images/litlogowhite.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";

const Header = ({room, name, view, navBack, toggleMenu, typing, usersInRoom, location}) => {
    let path = location.pathname;

    return  (
        <div className="header" style={path==='/'?{backgroundColor: 'white'}:null}>
             {path === '/chat' && (
                <>
                    <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
                        <div className="headerInfo">
                            <h2>{room}</h2>
                            <div className="usersInRoom">You{usersInRoom.map((user, i) => 
                                user.name !== name && <span key={i}>{', ' + user.name}</span>
                            )}</div>
                        </div>
                        <div className="typingInfo">{typing}</div>
                    <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
                </>
            )}
            {path === '/' && (
                // <>
                //     <div className="logo-wrap">
                //         <img className="logo" src={litlogowhite} />
                //     </div>
                // </>
                <></>
            )}
            {path === '/rooms' && (
                <>
                    <FontAwesomeIcon icon={faArrowLeft} className="backLink" onClick={()=>navBack()}/>
                        <h2>{name}</h2>
                    <FontAwesomeIcon icon={faBars} className="menuLink" onClick={()=>toggleMenu()}/>
                </>
            )}  
        </div>
    )

}

export default Header;