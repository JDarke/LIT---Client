
import React from 'react';


const SelectRoom = ({createRoomText, joinRoomText, joinRoom, handleChange, roomsList}) => {
    return (

        <ul id="messages">
            <div className="pageWrapper">
                <div className="publicRooms">
                    <h3  style={{marginTop: '0'}}>Create a room</h3>
                    
                    <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                        <input placeholder="Room" id="room" autoComplete="off" value={createRoomText} onChange={(e) => handleChange(e, 'createRoomText')} />
                        <span>
                            <input type="checkbox"></input> Room is public
                        </span>
                        <button onClick={()=>joinRoom(createRoomText)}>Create</button>
                    </form>
                    
                    <br />
                    <br />
                    <h3>Join Room</h3>
                    
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
                </div>
                
               
            </div>
        </ul>

    )
}

export default SelectRoom;



/*
   <ul id="messages">
            <div className="pageWrapper">
                <div className="publicRooms">
                    <h3>Public Rooms</h3>
                    <ul>
                        {roomsList.length > 0 ? roomsList.map((room, i) => (
                            <li key={i}>{room}</li>
                        )) : (
                            <li>No public rooms are active</li>
                        )}
                    </ul>
                    <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                        <input placeholder="Room" id="room" autoComplete="off" value={roomText} onChange={(e) => handleChange(e, 'roomText')} />
                        <span>
                            <input type="checkbox"></input> Room is public
                        </span>
                        <button onClick={()=>joinRoom(roomText)}>Create</button>
                    </form>
                </div>
                <br />
                <br />
                <h3>Create a room.</h3>
                
                <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                    <input placeholder="Room" id="room" autoComplete="off" value={roomText} onChange={(e) => handleChange(e, 'roomText')} />
                    <span>
                        <input type="checkbox"></input> Room is public
                    </span>
                    <button onClick={()=>joinRoom(roomText)}>Create</button>
                </form>
            </div>
        </ul>
*/