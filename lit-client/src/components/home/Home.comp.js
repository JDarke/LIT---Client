
import React from 'react';


const Home = ({nameText, login, handleChange, warnNameText}) => {
    return (
        <div className="pageWrapper">
            <h3>
                Choose a user name to begin.
            </h3>
            <div className="warnText">{warnNameText}</div>
            <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Name" id="name" autoComplete="off" value={nameText} onChange={(e) => handleChange(e, 'nameText')} />
                <button onClick={()=>login(nameText)}>Login</button>
            </form>
        </div>
    )
}

export default Home;