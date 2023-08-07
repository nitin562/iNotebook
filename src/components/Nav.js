import React, { useContext } from "react";
import "./nav.css";
import { Link, useNavigate } from "react-router-dom";
import youtube from "../Images/ytube.png";
import twitter from "../Images/twitter.png";
import linkedin from "../Images/Linkedin.png";
import facebook from "../Images/facebook.png";
import contextMenu from "../context/ContextSnip";
import userPic from "../Images/Logined.png";
export default function Nav() {
  const globalState = useContext(contextMenu);
  const navigate = useNavigate();
  return (
    <nav>
      <p id="head">iNotebook</p>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/WorkArea">Work Area</Link>
      </div>
      {globalState.state.login && (
        <div className="loginPanel">
          <img src={userPic} />
          <p>{localStorage.getItem("user")}</p>
        </div>
      )}
      <div className="Auth">
        <button
          className="LoginBtn"
          onClick={() => {
            if (globalState.state.login) {
              // do logout
              globalState.update({ login: false, notes: [] });
              localStorage.removeItem("token");
            } else {
              navigate("/login");
            }
          }}
        >
          {globalState.state.login ? "LogOut" : "Login/Sign-up"}
        </button>
      </div>
      <div className="social-media">
        <a href="http://youtube.com" target="_blank">
          <img src={youtube} alt="" />
        </a>
        <a href="http://facebook.com" target="_blank">
          <img src={facebook} alt="" />
        </a>
        <a href="http://twitter.com" target="_blank">
          <img src={twitter} alt="" />
        </a>
        <a href="http://linkedin.com" target="_blank">
          <img src={linkedin} alt="" />
        </a>
      </div>
    </nav>
  );
}
