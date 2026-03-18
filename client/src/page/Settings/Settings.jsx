import { useContext, useEffect, useState } from "react";
import "./settings.scss";

import AvatarImg from "../../assets/profile.jpg";
import { context } from "../../../Context/context";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const Settings = () => {
  const {
    user,
    getuser,
    UpdateUserDetails,
    changepassword,
    changeemail,
    getTwoFactorStatus,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
  } = useContext(context);
  const [profileForm, setProfileForm] = useState({
    eusername: "",
    emobile: "",
    ename: "",
    ebio: "",
  });
  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [loadingAction, setLoadingAction] = useState("");
  const [twoFactorStatus, setTwoFactorStatus] = useState({
    enabled: false,
    pending: false,
  });
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [disableCode, setDisableCode] = useState("");
  const [useBackupDisable, setUseBackupDisable] = useState(false);
  const [showDisablePanel, setShowDisablePanel] = useState(false);

  useEffect(() => {
    getuser();
    (async () => {
      const status = await getTwoFactorStatus();
      if (status?.data) {
        setTwoFactorStatus(status.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        eusername: user.username || "",
        emobile: user.phoneNumber || "",
        ename: user.fullname || "",
        ebio: user.bio || "",
      });
      setEmailForm((current) => ({
        ...current,
        email: user.email || "",
      }));
    }
  }, [user]);

  const onProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const onEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  const onPasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoadingAction("profile");
    await UpdateUserDetails(profileForm);
    await getuser();
    setLoadingAction("");
  };

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoadingAction("email");
    await changeemail(emailForm);
    await getuser();
    setLoadingAction("");
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setLoadingAction("password");
    await changepassword(passwordForm);
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
    });
    setLoadingAction("");
  };

  const handleSetupTwoFactor = async () => {
    setLoadingAction("2fa-setup");
    const response = await setupTwoFactor();
    if (response?.success) {
      setTwoFactorSetup(response.data);
      setBackupCodes([]);
      setTwoFactorCode("");
      setTwoFactorStatus({ enabled: false, pending: true });
    }
    setLoadingAction("");
  };

  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) return;
    setLoadingAction("2fa-verify");
    const response = await verifyTwoFactor({ token: twoFactorCode.trim() });
    if (response?.success) {
      setBackupCodes(response.data.backupCodes || []);
      setTwoFactorSetup(null);
      setTwoFactorCode("");
      setTwoFactorStatus({ enabled: true, pending: false });
      await getuser();
    }
    setLoadingAction("");
  };

  const handleDisableTwoFactor = async (e) => {
    e.preventDefault();
    const payload = useBackupDisable
      ? { backupCode: disableCode.trim() }
      : { token: disableCode.trim() };
    if (!payload.backupCode && !payload.token) return;
    setLoadingAction("2fa-disable");
    const response = await disableTwoFactor(payload);
    if (response?.success) {
      setTwoFactorStatus({ enabled: false, pending: false });
      setDisableCode("");
      setBackupCodes([]);
      setShowDisablePanel(false);
      await getuser();
    }
    setLoadingAction("");
  };

  return (
    <section className="settings">
      <div className="settings-content">
        <div className="account-settings-top">
          <div className="settings-heading">Account Settings</div>
          <div className="heading-sub-text">
            Here you can change your email address and password.
          </div>
          <div className="change-box">
            <div className="box-heading">Change Your Email Address</div>
            <form method="post" onSubmit={submitEmail}>
              <div className="row-box">
                <div className="top">
                  <i className="bx bxs-envelope"></i>
                  <span>Email Address</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={emailForm.email}
                  onChange={onEmailChange}
                />
              </div>
              <div className="row-box">
                <div className="top">
                  <i className="bx bxs-lock"></i>
                  <span>Password</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={emailForm.password}
                  onChange={onEmailChange}
                />
              </div>
              <div className="btn">
                <LoadingButton
                  type="submit"
                  loading={loadingAction === "email"}
                  loadingText="Updating email"
                >
                  Change
                </LoadingButton>
              </div>
            </form>
          </div>
          <div className="change-box">
            <div className="box-heading">Change Your Current Password</div>
            <form method="post" onSubmit={submitPassword}>
              <div className="row-box">
                <div className="top">
                  <i className="bx bxs-lock"></i>
                  <span>Current Password</span>
                </div>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={onPasswordChange}
                />
              </div>
              <div className="row-box">
                <div className="top">
                  <i className="bx bxs-lock-open"></i>
                  <span>New Password</span>
                </div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={onPasswordChange}
                />
              </div>
              <div className="btn">
                <LoadingButton
                  type="submit"
                  loading={loadingAction === "password"}
                  loadingText="Changing password"
                >
                  Change
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
        <div className="security-settings">
          <div className="settings-heading">Security Settings</div>
          <div className="heading-sub-text">
            Manage security features like two-factor authentication.
          </div>
          <div className="change-box">
            <div className="box-heading">Two-Factor Authentication</div>
            <div className="heading-sub-text">
              Add an extra layer of security to your account.
            </div>
            <div className="twofactor-row">
              <div className="twofactor-copy">
                {twoFactorStatus.enabled ? "2FA is enabled" : "Two-factor authentication"}
              </div>
              <button
                type="button"
                className={`switch-button ${twoFactorStatus.enabled ? "is-on" : ""}`}
                aria-pressed={twoFactorStatus.enabled}
                aria-label={
                  twoFactorStatus.enabled ? "Disable two-factor" : "Enable two-factor"
                }
                onClick={() => {
                  if (twoFactorStatus.enabled) {
                    setShowDisablePanel(true);
                  } else {
                    handleSetupTwoFactor();
                  }
                }}
              >
                <span className="switch-knob"></span>
              </button>
            </div>
            {twoFactorSetup && (
              <div className="row-box">
                <div className="top">
                  <i className="bx bx-qr"></i>
                  <span>Scan this QR in your authenticator app</span>
                </div>
                {twoFactorSetup.qrCodeDataUrl && (
                  <img
                    src={twoFactorSetup.qrCodeDataUrl}
                    alt="Two-factor QR"
                    style={{ width: "180px", marginTop: "12px" }}
                  />
                )}
                <div className="row-box">
                  <div className="top">
                    <i className="bx bx-key"></i>
                    <span>Manual setup key</span>
                  </div>
                  <input type="text" value={twoFactorSetup.secret || ""} readOnly />
                </div>
                <form method="post" onSubmit={handleVerifyTwoFactor}>
                  <div className="row-box">
                    <div className="top">
                      <i className="bx bx-shield-quarter"></i>
                      <span>Verification code</span>
                    </div>
                    <input
                      type="text"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="6-digit code"
                    />
                  </div>
                  <div className="btn">
                    <LoadingButton
                      type="submit"
                      loading={loadingAction === "2fa-verify"}
                      loadingText="Verifying"
                    >
                      Verify & Enable
                    </LoadingButton>
                  </div>
                </form>
              </div>
            )}
            {twoFactorStatus.enabled && showDisablePanel && (
              <div className="row-box">
                <div className="top">
                  <i className="bx bxs-shield"></i>
                  <span>2FA is enabled</span>
                </div>
                <form method="post" onSubmit={handleDisableTwoFactor}>
                  <div className="row-box">
                    <div className="top">
                      <i className="bx bx-key"></i>
                      <span>Disable with code</span>
                    </div>
                    <input
                      type="text"
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value)}
                      placeholder={useBackupDisable ? "Backup code" : "Authenticator code"}
                    />
                  </div>
                  <div className="auth-meta">
                    <label className="remember-row">
                      <input
                        type="checkbox"
                        checked={useBackupDisable}
                        onChange={(e) => setUseBackupDisable(e.target.checked)}
                      />
                      <span className="remember-box"></span>
                      <span>Use backup code</span>
                    </label>
                  </div>
                  <div className="btn">
                    <LoadingButton
                      type="submit"
                      loading={loadingAction === "2fa-disable"}
                      loadingText="Disabling"
                    >
                      Disable 2FA
                    </LoadingButton>
                  </div>
                </form>
              </div>
            )}
            {backupCodes.length > 0 && (
              <div className="row-box">
                <div className="top">
                  <i className="bx bx-lock-alt"></i>
                  <span>Backup codes (store these safely)</span>
                </div>
                <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
                  {backupCodes.map((code) => (
                    <span key={code} style={{ fontFamily: "monospace" }}>
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="profile-settings-bottom">
          <div className="settings-heading">Profile Settings</div>
          <div className="heading-sub-text">Manage your profile settings</div>
          <form method="post" onSubmit={submitProfile}>
            <div className="details-row-box">
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bxs-user"></i>
                  <span>Username</span>
                </div>
                <input
                  type="text"
                  name="eusername"
                  value={profileForm.eusername}
                  onChange={onProfileChange}
                />
              </div>
              <div className="details-box avatarImg">
                <img src={user?.avatar || AvatarImg} alt={user?.username || "Avatar"} />
                <button className="avatar-btn" type="button">
                  Remove
                </button>
                <button className="avatar-btn" type="button">
                  Change
                </button>
              </div>
            </div>
            <div className="details-row-box">
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bxs-phone"></i>
                  <span>Phone Number</span>
                </div>
                <input
                  type="tel"
                  name="emobile"
                  value={profileForm.emobile}
                  onChange={onProfileChange}
                />
              </div>
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bx-rename"></i>
                  <span>Name</span>
                </div>
                <input
                  type="text"
                  name="ename"
                  value={profileForm.ename}
                  onChange={onProfileChange}
                />
              </div>
            </div>
            <div className="details-row-box">
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bx-user-circle"></i>
                  <span>Bio</span>
                </div>
                <textarea
                  name="ebio"
                  id="bio"
                  rows="5"
                  value={profileForm.ebio}
                  onChange={onProfileChange}
                ></textarea>
              </div>
            </div>
            <div className="btn">
              <LoadingButton
                type="submit"
                loading={loadingAction === "profile"}
                loadingText="Saving profile"
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </div>
        <p className="account-create">
          This account was created on{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Unknown"}
        </p>
      </div>
    </section>
  );
};

export default Settings;
