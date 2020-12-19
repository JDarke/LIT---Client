import React from 'react';

const StatusBar = ({room, name}) => {

    return (
        <div className="statusBar">
            <h2>{name} in {room}</h2>
        </div>  
    )
    
}

export default StatusBar;