import "./signup.scss";
import React, { useContext, useEffect, useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import context from "../../../Context/context";
const Signup = () => {
  const navigate = useNavigate();
  const userContext = useContext(context);
  const { register, error, setError, setadminlogin } = userContext;
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const HandleSignIn = async () => {
    if (user.password !== user.confirmPassword) {
      console.log("Confirm password is not correct");
      setError("Confirm password is not correct");
      console.log(user);
    } else {
      await register(user);
      setadminlogin(true);
      navigate("/dashboard");
    }
  };
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {}, [error]);

  return (
    <section className="sign-in">
      <div className="main-content">
        <div className="login-box">
          <span className="round-1"></span>
          <span className="round-2"></span>
          <div className="box">
            <div className="heading">Sign In Here</div>
            <div className="error-box">{error}</div>
            {/* username */}
            <form method="post">
              <div className="input-box">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="username"
                  placeholder="username or email"
                  name="username"
                  value={user.username}
                  onChange={onChange}
                  required
                />
              </div>
              {/* fullname */}
              <div className="input-box">
                <label htmlFor="fullname">Fullname</label>
                <input
                  type="text"
                  id="fullname"
                  className="fullname"
                  placeholder="fullname"
                  name="fullname"
                  value={user.fullname}
                  onChange={onChange}
                  required
                />
              </div>

              {/* email */}
              <div className="input-box">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="email"
                  placeholder="email"
                  name="email"
                  value={user.email}
                  onChange={onChange}
                  required
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
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={onChange}
                  required
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
                  name="password"
                  value={user.password}
                  onChange={onChange}
                  required
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
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={onChange}
                  required
                />
              </div>
            </form>
            <button
              className="login-button"
              type="submit"
              onClick={HandleSignIn}
            >
              Sign In
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
