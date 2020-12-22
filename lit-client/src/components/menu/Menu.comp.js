import React from 'react';
//import { Slide } from "react-awesome-reveal";

const Menu = ({ view, roomInfo, name }) => {

    return (
        <div className="menu">  
            <ul>
                <li>Exit</li>
                <li>Select Room</li>
                <li>Room Info</li>
            </ul>   
        </div>
    )    
}

export default Menu;
