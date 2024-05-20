import React, { useState } from "react";
import "./navber.scss";
import logo from "../../assets/logo1.png";

import { Link } from "react-router-dom";
const Navber = () => {
  const [showNav, setshowNav] = useState(false);
  const ShowBtn = () => {
    setshowNav(!showNav);
  };

  return (
    <>
      <header className="navber">
        <div className="navber-content">
          <Link to="/" className="logo">
            <img src={logo} alt="logo" />
            <div className="logo-text">
              mem<span>ois</span>
            </div>
          </Link>
          <div className="mobile-device">
            <Link to="/login" className="mobile-login">
              Login
            </Link>
            <i
              className={`bx ${showNav ? "bx-x" : "bx-menu"} menuicon`}
              onClick={ShowBtn}
              id="menuicon"
            ></i>
          </div>
          <div className={`content ${showNav ? "active" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/use-for">Use for</Link>
            <Link to="/faq">
              FAQ'<span>s</span>
            </Link>
            <Link to="/login" className="desktop-login">
              Login
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navber;
