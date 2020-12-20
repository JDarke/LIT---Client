
import React from 'react';


const SelectRoom = ({roomText, joinRoom, handleChange}) => {
    return (

        <ul id="messages">
            <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Room" id="room" autoComplete="off" value={roomText} onChange={(e) => handleChange(e, 'roomText')} />
                <button onClick={()=>joinRoom(roomText)}>Login</button>
            </form>
        </ul>

    )
}

export default SelectRoom;