import "./login.scss";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { context } from "../../../Context/context";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const usecontext = useContext(context);
  const { login, error, setadminlogin, setcreateEvent, setError, showToast } =
    usecontext;

  const [loginuser, setUser] = useState({
    username: "",
    password: "",
  });
  const [allowInput, setAllowInput] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("memois_remembered_username");
    const savedRemember = localStorage.getItem("memois_remember_me") === "true";

    if (savedUsername && savedRemember) {
      setUser((current) => ({ ...current, username: savedUsername }));
      setRememberMe(true);
      setAllowInput(true);
    }
  }, []);

  // useEffect(() => {
  //   if (localStorage.getItem("token") || localStorage.getItem("userId")) {
  //     navigate("/");
  //   }
  // }, []);

  const HandleLogIn = async (e) => {
    e.preventDefault();
    const identifier = loginuser.username.trim();
    const password = loginuser.password.trim();

    if (!identifier) {
      setError("Username or email is required");
      showToast("Username or email is required", "error");
      return;
    }

    if (identifier.includes("@") && !emailPattern.test(identifier)) {
      setError("Please enter a valid email address");
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!password) {
      setError("Password is required");
      showToast("Password is required", "error");
      return;
    }

    setIsSubmitting(true);
    const response = await login({
      username: identifier,
      password: loginuser.password,
    });
    setIsSubmitting(false);

    if (response?.success) {
      if (rememberMe) {
        localStorage.setItem("memois_remembered_username", identifier);
        localStorage.setItem("memois_remember_me", "true");
      } else {
        localStorage.removeItem("memois_remembered_username");
        localStorage.removeItem("memois_remember_me");
      }

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
    setUser({ ...loginuser, [e.target.name]: e.target.value });
  };

  const enableManualEntry = () => {
    if (!allowInput) {
      setAllowInput(true);
    }
  };

  const isLoginDisabled =
    !loginuser.username.trim() || !loginuser.password.trim();

  return (
    <section className="login">
      <div className="main-content">
        <div className="login-box">
          <div className="box">
            <div className="heading">Login Here</div>
            <div className="auth-subheading">
              Sign in to manage your events, upload media, and share private galleries.
            </div>
            <div className="error-box">{error}</div>
            <form method="post" autoComplete="off" onSubmit={HandleLogIn}>
              <div className="trap-fields" aria-hidden="true">
                <input type="text" name="fake-username" autoComplete="username" tabIndex="-1" />
                <input
                  type="password"
                  name="fake-password"
                  autoComplete="current-password"
                  tabIndex="-1"
                />
              </div>
              <div className="input-box">
                <label htmlFor="login-username">Username</label>
                <input
                  type="text"
                  id="login-username"
                  className="username"
                  placeholder="username or email"
                  name="username"
                  value={loginuser.username}
                  onChange={onChange}
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  readOnly={!allowInput}
                />
              </div>
              <div className="input-box">
                <label htmlFor="login-password">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  className="password"
                  placeholder="password"
                  name="password"
                  value={loginuser.password}
                  onChange={onChange}
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
              <div className="auth-meta">
                <label className="remember-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="remember-box"></span>
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgotPassword">
                  Forgot Password?
                </Link>
              </div>
              <LoadingButton
                className="login-button"
                type="submit"
                disabled={isLoginDisabled}
                loading={isSubmitting}
                loadingText="Signing in"
              >
                Log In
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

            <Link to="/signup" state={location.state} className="registration">
              Don&apos;t have an account? <span>Register here</span>&rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
