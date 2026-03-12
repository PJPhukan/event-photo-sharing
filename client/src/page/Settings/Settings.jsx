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

  useEffect(() => {
    getuser();
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
