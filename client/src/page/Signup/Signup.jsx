import "./signup.scss";
import React from "react";
import { Link } from "react-router-dom";
const Signup = () => {
  return (
    <section className="sign-in">
      <div className="main-content">
        <div className="login-box">
          <span className="round-1"></span>
          <span className="round-2"></span>
          <div className="box">
            <div className="heading">Sign In Here</div>
            {/* username */}
            <div className="input-box">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="username"
                placeholder="username or email"
              />
            </div>
            {/* fullname */}
            {/* <div className="input-box">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="text"
                id="fullname"
                className="fullname"
                placeholder="fullname"
              />
            </div> */}

            {/* email */}
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="email"
                placeholder="email"
              />
            </div>

            {/* phone Number */}
            <div className="input-box">
              <label htmlFor="number">Phone number</label>
              <input
                type="Number"
                id="number"
                className="number"
                placeholder="Phone number"
              />
            </div>

            {/* password */}
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="password"
                placeholder="password"
              />
            </div>

            {/* confirm password */}
            <div className="input-box">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                className="confirm-password"
                placeholder="Confirm password"
              />
            </div>
            <button className="login-button">Log In</button>
            <div className="or">
              <span className="line">or</span>
            </div>
            <div className="login-with">
              <div className="with-box">
                <i className="bx bxl-google"></i>
                <span>Google</span>
              </div>
              <div className="with-box">
                <i className="bx bxl-facebook"></i>
                <span>Facebook</span>
              </div>
            </div>
            <Link to="/login" className="registration">
              Already have an account? <span>Login here</span>&rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
