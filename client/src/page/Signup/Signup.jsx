import "./signup.scss";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { context } from "../../../Context/context";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._]{3,20}$/;
const phonePattern = /^\d{10,15}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useContext(context);
  const { register, error, setError, setadminlogin, setcreateEvent, showToast } =
    userContext;
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [allowInput, setAllowInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const HandleSignIn = async (e) => {
    e.preventDefault();

    const payload = {
      username: user.username.trim().toLowerCase(),
      fullname: user.fullname.trim(),
      email: user.email.trim().toLowerCase(),
      phoneNumber: user.phoneNumber.trim(),
      password: user.password,
      confirmPassword: user.confirmPassword,
    };

    if (!payload.username || !payload.fullname || !payload.email || !payload.phoneNumber) {
      setError("All fields are required");
      showToast("All fields are required", "error");
      return;
    }

    if (!usernamePattern.test(payload.username)) {
      setError(
        "Username must be 3-20 characters and use only letters, numbers, dots or underscores"
      );
      showToast(
        "Username must be 3-20 characters and use only letters, numbers, dots or underscores",
        "error"
      );
      return;
    }

    if (!emailPattern.test(payload.email)) {
      setError("Please enter a valid email address");
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!phonePattern.test(payload.phoneNumber)) {
      setError("Please enter a valid phone number");
      showToast("Please enter a valid phone number", "error");
      return;
    }

    if (!passwordPattern.test(payload.password)) {
      setError("Password must be at least 8 characters and include letters and numbers");
      showToast(
        "Password must be at least 8 characters and include letters and numbers",
        "error"
      );
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setError("Confirm password is not correct");
      showToast("Confirm password is not correct", "error");
      return;
    }

    setIsSubmitting(true);
    const response = await register({
      username: payload.username,
      fullname: payload.fullname,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
    });
    setIsSubmitting(false);

    if (response?.success) {
      setadminlogin(true);
      if (location.state?.redirectToCreateEvent) {
        setcreateEvent(true);
        navigate("/dashboard/event");
        return;
      }
      navigate("/");
    }
  };
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const enableManualEntry = () => {
    if (!allowInput) {
      setAllowInput(true);
    }
  };

  const isSignupDisabled =
    !user.username.trim() ||
    !user.fullname.trim() ||
    !user.email.trim() ||
    !user.phoneNumber.trim() ||
    !user.password.trim() ||
    !user.confirmPassword.trim();

  return (
    <section className="sign-in">
      <div className="main-content">
        <div className="login-box">
          <span className="round-1"></span>
          <span className="round-2"></span>
          <div className="box">
            <div className="heading">Sign Up Here</div>
            <div className="auth-subheading">
              Create an account to launch your event and start collecting guest photos.
            </div>
            <div className="error-box">{error}</div>
            {/* username */}
            <form
              method="post"
              autoComplete="off"
              onSubmit={HandleSignIn}
              className="signup-form"
            >
              <div className="trap-fields" aria-hidden="true">
                <input type="text" name="fake-signup-user" autoComplete="username" tabIndex="-1" />
                <input type="email" name="fake-signup-email" autoComplete="email" tabIndex="-1" />
                <input type="password" name="fake-signup-pass" autoComplete="new-password" tabIndex="-1" />
              </div>
              <div className="input-box">
                <label htmlFor="signup-username">Username</label>
                <input
                  type="text"
                  id="signup-username"
                  className="username"
                  placeholder="username"
                  name="username"
                  value={user.username}
                  onChange={onChange}
                  required
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  readOnly={!allowInput}
                />
              </div>
              {/* fullname */}
              <div className="input-box">
                <label htmlFor="signup-fullname">Fullname</label>
                <input
                  type="text"
                  id="signup-fullname"
                  className="fullname"
                  placeholder="fullname"
                  name="fullname"
                  value={user.fullname}
                  onChange={onChange}
                  required
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="off"
                  readOnly={!allowInput}
                />
              </div>

              {/* email */}
              <div className="input-box">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  className="email"
                  placeholder="email"
                  name="email"
                  value={user.email}
                  onChange={onChange}
                  required
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  readOnly={!allowInput}
                />
              </div>

              {/* phone Number */}
              <div className="input-box">
                <label htmlFor="signup-number">Phone number</label>
                <input
                  type="tel"
                  id="signup-number"
                  className="number"
                  placeholder="Phone number"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={onChange}
                  required
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="off"
                  readOnly={!allowInput}
                />
              </div>

              {/* password */}
              <div className="input-box">
                <label htmlFor="signup-password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="signup-password"
                  className="password"
                  placeholder="password"
                  name="password"
                  value={user.password}
                  onChange={onChange}
                  required
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="new-password"
                  readOnly={!allowInput}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <i className={`bx ${showPassword ? "bx-hide" : "bx-show"}`}></i>
                </button>
              </div>

              {/* confirm password */}
              <div className="input-box">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="signup-confirm-password"
                  className="confirm-password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={onChange}
                  required
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="new-password"
                  readOnly={!allowInput}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  <i
                    className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"}`}
                  ></i>
                </button>
              </div>
              <LoadingButton
                className="login-button"
                type="submit"
                disabled={isSignupDisabled}
                loading={isSubmitting}
                loadingText="Creating account"
              >
                Sign Up
              </LoadingButton>
            </form>

            <div className="social-auth">
              <div className="divider">
                <span>or continue with</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-button">
                  <i className="bx bxl-google"></i>
                  <span>Google</span>
                </button>
                <button type="button" className="social-button">
                  <i className="bx bxl-apple"></i>
                  <span>Apple</span>
                </button>
              </div>
            </div>

            <Link to="/login" state={location.state} className="registration">
              Already have an account? <span>Login here</span>&rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
