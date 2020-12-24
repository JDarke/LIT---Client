import React from 'react';

const SelectRoom = ({createRoomText, joinRoomText, warnJoinRoomText, warnCreateRoomText, createRoom, joinRoom, handleChange, roomsList}) => {
    return (
        <div className="pageWrapper">
            {/* <div className="publicRooms"> */}
                <h3  style={{marginTop: '0'}}>Create a room</h3>
                <div className="warnText">{warnCreateRoomText}</div>
                <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                    <input placeholder="Room" id="room" autoComplete="off" value={createRoomText} onChange={(e) => handleChange(e, 'createRoomText')} />
                    <span>
                        <input type="checkbox"></input> Room is public
                    </span>
                    <button onClick={()=>createRoom(createRoomText)}>Create</button>
                </form>
                
                <br />
                <br />
                <h3>Join Room</h3>
                <div className="warnText">{warnJoinRoomText}</div>
                <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                    <input placeholder="Room" id="room" autoComplete="off" value={joinRoomText} onChange={(e) => handleChange(e, 'joinRoomText')} />
                    <button onClick={()=>joinRoom(joinRoomText)}>Join</button>
                </form>
                <br />
                <h4>Public Rooms:</h4>
                <ul style={{marginTop: '-5px'}}>
                    {roomsList.length > 0 ? roomsList.map((room, i) => (
                        <li key={i}>{room}</li>
                    )) : (
                        <li>No public rooms are active</li>
                    )}
                </ul>
            {/* </div> */}
        </div>
    )
}

export default SelectRoom;