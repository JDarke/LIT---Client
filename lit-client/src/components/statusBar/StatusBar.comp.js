import React from 'react';

const StatusBar = ({room, name, view}) => {

    return view === 'signin' ? (
        <div className="statusBar">
            <h2>LIT Chat - Login</h2>
        </div>
    ):(
        <div className="statusBar">
            <h2>{name} in {room}</h2>
        </div>  
    )
    
}

export default StatusBar;