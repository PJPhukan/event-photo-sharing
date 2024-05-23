import "./login.scss";
import React from "react";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <section className="login">
      <div className="main-content">
        <div className="login-box">
          <div className="box">
            <div className="heading">Login Here</div>

            <div className="input-box">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="username"
                placeholder="username or email"
              />
            </div>
            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="password"
                placeholder="password"
              />
            </div>
              <Link to="/forgot-password" className="forgotPassword">
                Forgot Password?
              </Link>
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
            
            <Link to="/signup" className="registration">
                Don't have an account? <span>Register here</span>&rarr;
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
