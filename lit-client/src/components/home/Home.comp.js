
import React from 'react';


const Home = ({nameText, login, handleChange, warnText}) => {
    return (
        <div className="pageWrapper">
            <div className="pageText">
                Choose a user name to begin.
            </div>
            <div className="warnText">{warnText}</div>
            <form className="loginForm" action="" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Name" id="name" autoComplete="off" value={nameText} onChange={(e) => handleChange(e, 'nameText')} />
                <button onClick={()=>login(nameText)}>Login</button>
            </form>
        </div>
    )
}

export default Home;