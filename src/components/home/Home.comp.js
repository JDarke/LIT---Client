import React from "react";
import './home.scss';
import litlogowhite from '../../images/litlogowhite.png'

const Home = ({ nameText, login, handleChange, warnNameText }) => {
  return (
    <div className="pageWrapper" style={{ marginTop: "40px" }}>
      <br />
      <div className="logo-wrap"><img className="logo" src={litlogowhite} /></div>
      <br />
      <br />
      <p>Choose a user name</p>
      <div className="warnText">{warnNameText}</div>
      <form
        className="loginForm"
        action=""
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          placeholder="Name"
          id="name"
          autoComplete="off"
          value={nameText}
          onChange={(e) => handleChange(e, "nameText")}
        />
        <button onClick={() => login(nameText)}>Login</button>
      </form>
    </div>
  );
};

export default Home;
