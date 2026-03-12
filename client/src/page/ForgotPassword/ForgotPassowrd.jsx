import { useContext, useMemo, useState } from "react";
import "./forgotpassword.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { context } from "../../../Context/context";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const ForgotPassowrd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    forgotPassword,
    verifyOtp,
    resetPassword,
    error,
    setError,
    showToast,
    setadminlogin,
    setcreateEvent,
  } = useContext(context);

  const [allowInput, setAllowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const otpValue = useMemo(() => otp.join(""), [otp]);
  const isSendOtpDisabled = !email.trim();
  const isVerifyOtpDisabled = otpValue.length !== 6;
  const isResetPasswordDisabled =
    !passwords.newPassword.trim() || !passwords.confirmPassword.trim();

  const enableManualEntry = () => {
    if (!allowInput) {
      setAllowInput(true);
    }
  };

  const handleOtpChange = (index, value) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = nextValue;
    setOtp(nextOtp);

    if (nextValue && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const previousInput = document.getElementById(`otp-${index - 1}`);
      previousInput?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otp.length);

    if (!pasted) {
      return;
    }

    event.preventDefault();
    const nextOtp = [...otp];
    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);

    const focusIndex = Math.min(pasted.length, otp.length - 1);
    const targetInput = document.getElementById(`otp-${focusIndex}`);
    targetInput?.focus();
  };

  const handleRequestOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required");
      showToast("Email is required", "error");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address");
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoadingStage("send");
    const response = await forgotPassword({ email: normalizedEmail });
    setLoadingStage("");
    if (response?.success) {
      setEmail(normalizedEmail);
      setOtpRequested(true);
      setOtpVerified(false);
      setOtp(["", "", "", "", "", ""]);
      setPasswords({ newPassword: "", confirmPassword: "" });
      setAllowInput(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit verification code");
      showToast("Please enter the 6-digit verification code", "error");
      return;
    }

    setLoadingStage("verify");
    const response = await verifyOtp({
      email,
      otp: otpValue,
    });
    setLoadingStage("");

    if (response?.success) {
      setOtpVerified(true);
    }
  };

  const handleChangeEmail = () => {
    setOtpRequested(false);
    setOtpVerified(false);
    setOtp(["", "", "", "", "", ""]);
    setPasswords({ newPassword: "", confirmPassword: "" });
    setAllowInput(true);
  };

  const handleResetPassword = async () => {
    if (!passwords.newPassword || !passwords.confirmPassword) {
      setError("Both password fields are required");
      showToast("Both password fields are required", "error");
      return;
    }

    if (!passwordPattern.test(passwords.newPassword)) {
      setError("Password must be at least 8 characters and include letters and numbers");
      showToast(
        "Password must be at least 8 characters and include letters and numbers",
        "error"
      );
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Confirm password is not correct");
      showToast("Confirm password is not correct", "error");
      return;
    }

    setLoadingStage("reset");
    const response = await resetPassword({
      email,
      otp: otpValue,
      newPassword: passwords.newPassword,
    });
    setLoadingStage("");

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

  return (
    <section className="forgot-password">
      <div className="main-content">
        <div className="login-box">
          <div className="box">
            <div className="heading">Forgot Password?</div>
            <div className="auth-subheading">
              Enter your email, verify the OTP, then choose a new password.
            </div>
            <div className="error-box">{error}</div>

            <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
              <div className="trap-fields" aria-hidden="true">
                <input
                  type="text"
                  name="fake-forgot-user"
                  autoComplete="username"
                  tabIndex="-1"
                />
                <input
                  type="password"
                  name="fake-forgot-password"
                  autoComplete="current-password"
                  tabIndex="-1"
                />
              </div>

              <div className="input-box email-box">
                <label htmlFor="forgot-email">Email</label>
                <input
                  type="email"
                  id="forgot-email"
                  className="forgot-email"
                  placeholder="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  onFocus={enableManualEntry}
                  onMouseDown={enableManualEntry}
                  readOnly={otpRequested || !allowInput}
                />
              </div>

              {!otpRequested && (
                <LoadingButton
                  className="login-button"
                  type="button"
                  disabled={isSendOtpDisabled}
                  loading={loadingStage === "send"}
                  loadingText="Sending OTP"
                  onClick={handleRequestOtp}
                >
                  Send OTP
                </LoadingButton>
              )}

              {otpRequested && (
                <>
                  <div className="email-actions">
                    <button
                      type="button"
                      className="forgotPassword inline-button"
                      onClick={handleChangeEmail}
                    >
                      Change email
                    </button>
                  </div>

                  <div className="input-box otp-box">
                    <label>Verification Code</label>
                    <div className="otp-inputs" onPaste={handleOtpPaste}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          id={`otp-${index}`}
                          className="otp-digit"
                          inputMode="numeric"
                          autoComplete={index === 0 ? "one-time-code" : "off"}
                          maxLength="1"
                          value={digit}
                          onChange={(event) => handleOtpChange(index, event.target.value)}
                          onKeyDown={(event) => handleOtpKeyDown(index, event)}
                          onFocus={enableManualEntry}
                          onMouseDown={enableManualEntry}
                          readOnly={!allowInput || otpVerified}
                        />
                      ))}
                    </div>
                  </div>

                  {!otpVerified ? (
                    <>
                      <div className="verify-code">
                        Didn&apos;t receive code?&nbsp;
                        <button
                          type="button"
                          className="forgotPassword inline-button"
                          onClick={handleRequestOtp}
                        >
                          Request again
                        </button>
                      </div>
                      <LoadingButton
                        className="login-button"
                        type="button"
                        disabled={isVerifyOtpDisabled}
                        loading={loadingStage === "verify"}
                        loadingText="Verifying"
                        onClick={handleVerifyOtp}
                      >
                        Verify OTP
                      </LoadingButton>
                    </>
                  ) : (
                    <>
                      <div className="verify-code verified-copy">
                        OTP verified. Set your new password below.
                      </div>
                      <div className="input-box">
                        <label htmlFor="forgot-new-password">New Password</label>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="forgot-new-password"
                          placeholder="new password"
                          value={passwords.newPassword}
                          onChange={(event) =>
                            setPasswords((current) => ({
                              ...current,
                              newPassword: event.target.value,
                            }))
                          }
                          autoComplete="new-password"
                          onFocus={enableManualEntry}
                          onMouseDown={enableManualEntry}
                          readOnly={!allowInput}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                          onClick={() => setShowNewPassword((current) => !current)}
                        >
                          <i
                            className={`bx ${showNewPassword ? "bx-hide" : "bx-show"}`}
                          ></i>
                        </button>
                      </div>
                      <div className="input-box">
                        <label htmlFor="forgot-confirm-password">Confirm Password</label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="forgot-confirm-password"
                          placeholder="confirm password"
                          value={passwords.confirmPassword}
                          onChange={(event) =>
                            setPasswords((current) => ({
                              ...current,
                              confirmPassword: event.target.value,
                            }))
                          }
                          autoComplete="new-password"
                          onFocus={enableManualEntry}
                          onMouseDown={enableManualEntry}
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
                        type="button"
                        disabled={isResetPasswordDisabled}
                        loading={loadingStage === "reset"}
                        loadingText="Resetting"
                        onClick={handleResetPassword}
                      >
                        Reset Password
                      </LoadingButton>
                    </>
                  )}
                </>
              )}
            </form>

            <Link to="/login" className="registration">
              Remember your password? <span>Login here</span>&rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassowrd;
