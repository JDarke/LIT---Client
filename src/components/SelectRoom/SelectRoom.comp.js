import React from "react";
import litlogowhite from '../../images/litlogowhite.png'

const SelectRoom = ({
  createRoomText,
  joinRoomText,
  handleClickRoom,
  warnJoinRoomText,
  warnCreateRoomText,
  createRoom,
  joinRoom,
  handleChange,
  handleRoomTab,
  roomsList,
  view,
  name
}) => {
  return (
    <div className="pageWrapper">
        <div className="selectRoomTabs">
            <div className={view === 'createRoom' ? "roomTab active": "roomTab"} onClick={()=> handleRoomTab('createRoom')}>Create a room</div>
            <div className={view === 'joinRoom' ? "roomTab active": "roomTab"} onClick={()=> handleRoomTab('joinRoom')}>Join a room</div>
        </div>
            {view === "createRoom" && (
                <div className="selectWrapper">
                    <br />
                    {/* <div className="logo-wrap"><img className="logo" src={litlogowhite} /></div> */}
                    <br />
                    <p>Enter a name for your room, and choose whether to make it public</p>
                    <div className="warnText">{warnCreateRoomText}</div>
                    <form
                        className="loginForm"
                        action=""
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                        placeholder="Room name"
                        id="room"
                        autoComplete="off"
                        value={createRoomText}
                        onChange={(e) => handleChange(e, "createRoomText")}
                        />
                        
                        <button onClick={() => createRoom(createRoomText)}>Create</button>
                        <span>
                            <input type="checkbox"></input> Room is public
                        </span>
                    </form>
                </div>
            )}
            {view === "joinRoom" && (
                <div className="selectWrapper">
                    <br />
                    <br />
                   {/* <div className="logo-wrap"><img className="logo" src={litlogowhite} /></div> */}
                    <p>Select a public room or enter the name of a private room to join</p>
                    <div className="warnText">{warnJoinRoomText}</div>
                    <form
                        className="loginForm"
                        action=""
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                        placeholder="Room name"
                        id="room"
                        autoComplete="off"
                        value={joinRoomText}
                        onChange={(e) => handleChange(e, "joinRoomText")}
                        />
                        <button onClick={() => joinRoom(joinRoomText)}>Join</button>
                    </form>
                    <br />
                    <h4>Public Rooms:</h4>
                    <ul className="publicRoomsList" style={{ marginTop: "-5px" }}>
                        {roomsList.length > 0 ? (
                        roomsList.map((room, i) => <li className="publicRoom" onClick={() => handleClickRoom(room) } key={i}>{room}</li>)
                        ) : (
                        <li>No public rooms are active</li>
                        )}
                    </ul>
                </div>
            )}
            </div>
  );
};

export default SelectRoom;
