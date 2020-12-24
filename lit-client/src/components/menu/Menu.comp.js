import React from 'react';
import {useTransition, animated} from 'react-spring'
//import { Slide } from "react-awesome-reveal";

const Menu = ({ view, roomInfo, name, showMenu }) => {
    const transitions = useTransition(showMenu, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })
    return transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={props} className="menu">  
                    <ul>
                        <li><h3>Menu</h3></li>
                        <li>Exit</li>
                        <li>Select Room</li>
                        <li>Room Info</li>
                    </ul>   
                </animated.div>
    )    
}

export default Menu;
