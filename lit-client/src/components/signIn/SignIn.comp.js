
import React from 'react';


const SignIn = ({nameText, roomText, login, handleChange}) => {
    return (
        <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
            Name:
            <input id="name" autoComplete="off" value={nameText} onChange={(e) => handleChange(e, 'nameText')} />
            Room:
            <input id="room" autoComplete="off" value={roomText} onChange={(e) => handleChange(e, 'roomText')} />
            <button onClick={()=>login(nameText, roomText)}>Send</button>
        </form>
    )
}

export default SignIn;