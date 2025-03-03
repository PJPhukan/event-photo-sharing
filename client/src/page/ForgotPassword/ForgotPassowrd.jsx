import React from "react";
import "./forgotpassword.scss";
import { Link } from "react-router-dom";
const ForgotPassowrd = () => {
  return (
    <section className="forgot-password">
      <div className="main-content">
        <div className="login-box">
          <div className="box">
            <div className="heading">Forgot Password?</div>

            <div className="input-box">
              <label htmlFor="username">Email</label>
              <input
                type="text"
                id="username"
                className="username"
                placeholder="email"
              />
            </div>
            <div className="input-box">
              <label htmlFor="password">Verification Code</label>
              <input
                type="password"
                id="password"
                className="password"
                placeholder="verification code"
              />
            </div>
            <div className="verify-code">
              Didn't recive code?&nbsp;
              <Link to="/forgot-password" className="forgotPassword">
                Request again
              </Link>
            </div>
            <button className="login-button">
              <Link to="/verify-user" className="verify">
                Verify
              </Link>
            </button>
            <div className="or">
              <span className="line">or</span>
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

export default ForgotPassowrd;
