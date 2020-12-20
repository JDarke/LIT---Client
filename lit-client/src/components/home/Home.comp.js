
import React from 'react';


const Home = ({nameText, login, handleChange}) => {
    return (

        <ul id="messages">
            <form className="nameForm" action="" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="Name" id="name" autoComplete="off" value={nameText} onChange={(e) => handleChange(e, 'nameText')} />
                <button onClick={()=>login(nameText)}>Login</button>
            </form>
        </ul>

    )
}

export default Home;