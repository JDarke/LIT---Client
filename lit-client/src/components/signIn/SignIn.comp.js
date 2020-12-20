
import React from 'react';


const SignIn = ({nameText, roomText, login, handleChange}) => {
    return (

        <ul id="messages">
            <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Name" id="name" autoComplete="off" value={nameText} onChange={(e) => handleChange(e, 'nameText')} />
                <input placeholder="Room" id="room" autoComplete="off" value={roomText} onChange={(e) => handleChange(e, 'roomText')} />
                <button onClick={()=>login(nameText, roomText)}>Login</button>
            </form>
        </ul>

    )
}

export default SignIn;