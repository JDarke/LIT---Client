import React from 'react';
import {useTransition, animated} from 'react-spring';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
//import { Slide } from "react-awesome-reveal";

const Menu = ({ view, roomInfo, name, showMenu, toggleMenu, litMode, toggleLitMode }) => {
    const transitions = useTransition(showMenu, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })
    return transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={props} className="menu">  
                    <FontAwesomeIcon icon={faTimes} className="menuLink" onClick={()=>toggleMenu()}/>
                    <ul>
                        <li><h3>Menu</h3></li>
                        <li onClick={()=>toggleLitMode()}>Translation mode: {litMode ? 'On' : 'Off'}</li>
                        {/* <li>Room Info</li>
                        <li>Exit</li> */}
                    </ul>   
                </animated.div>
    )    
}

export default Menu;
