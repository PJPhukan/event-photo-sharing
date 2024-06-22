import "./login.scss";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import context from "../../../Context/context";
const Login = () => {
  const navigate = useNavigate();
  const usecontext = useContext(context);
  const { login, error, setadminlogin, user, setError } = usecontext;

  const [loginuser, setUser] = useState({
    username: "",
    password: "",
  });

  const HandleLogIn = async () => {
    const response = await login(loginuser);
    if (response.data.success) {
      setadminlogin(true);
      navigate("/");
    } else {
      setError(response.data.message);
    }
  };

  const onChange = (e) => {
    setUser({ ...loginuser, [e.target.name]: e.target.value });
  };

  useEffect(() => {}, [error, user]);

  return (
    <section className="login">
      <div className="main-content">
        <div className="login-box">
          <div className="box">
            <div className="heading">Login Here</div>
            <div className="error-box">{error}</div>
            <form method="post">
              <div className="input-box">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="username"
                  placeholder="username or email"
                  name="username"
                  value={loginuser.username}
                  onChange={onChange}
                />
              </div>
              <div className="input-box">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="password"
                  placeholder="password"
                  name="password"
                  value={loginuser.password}
                  onChange={onChange}
                />
              </div>
              <Link to="/forgot-password" className="forgotPassword">
                Forgot Password?
              </Link>
            </form>
            <button
              className="login-button"
              type="submit"
              onClick={HandleLogIn}
            >
              Log In
            </button>
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
