import React from "react";
import "./settings.scss";

import AvatarImg from "../../assets/profile.jpg";
const Settings = () => {
  const Onchange = (e) => {
    seteuser({ ...euser, [e.target.name]: e.target.value });
  };
  return (
    <section className="settings">
      <div className="settings-content">
        <div className="account-settings-top">
          <div className="settings-heading">Account Settings</div>
          <div className="heading-sub-text">
            Here you can change your email address you use on Adshares and your
            password.
          </div>
          <div className="change-box">
            <div className="box-heading">Change Your Email Address</div>
            <form method="post">
              <div className="row-box">
                <div className="top">
                  <i className="bx bxs-envelope"></i>
                  <span>Email Address</span>
                </div>
                <input type="email" />
              </div>
              <div className="row-box">
                <div className="top">
                  <i class="bx bxs-lock"></i>
                  <span>Password</span>
                </div>
                <input type="password" />
              </div>
              <div className="btn">
                <input type="submit" value="Change" />
              </div>
            </form>
          </div>
          <div className="change-box">
          <div className="box-heading">Change Your Current Password</div>
            <form method="post">
              <div className="row-box">
                <div className="top">
                  <i class="bx bxs-lock"></i>
                  <span>Current Password</span>
                </div>
                <input type="password" />
              </div>
              <div className="row-box">
                <div className="top">
                  <i class="bx bxs-lock-open"></i>
                  <span>New Password</span>
                </div>
                <input type="password" />
              </div>
              <div className="btn">
                <input type="submit" value="Change" />
              </div>
            </form>
          </div>
        </div>
        <div className="profile-settings-bottom">
          <div className="settings-heading">Profile Settings</div>
          <div className="heading-sub-text">Manage your profile settings</div>
          <form method="post">
            <div className="details-row-box">
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bxs-user"></i>
                  <span>Username</span>
                </div>
                <input type="text" name="eusername" onChange={Onchange} />
              </div>
              <div className="details-box avatarImg">
                <img src={AvatarImg} alt="" />
                <button className="avatar-btn">Remove</button>
                <button className="avatar-btn">Change</button>
              </div>
            </div>
            <div className="details-row-box">
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bxs-phone"></i>
                  <span>Phone Number</span>
                </div>
                <input type="tel" name="eusername" onChange={Onchange} />
              </div>
              <div className="details-box">
                <div className="user-title">
                  <i className="bx bx-rename"></i>
                  <span>Name</span>
                </div>
                <input type="text" name="ebio" onChange={Onchange} />
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
                  type="text"
                  onChange={Onchange}
                ></textarea>
              </div>
            </div>
            <div className="btn">
              <input type="submit" value="Save" />
            </div>
          </form>
        </div>
        <p className="account-create">This account was created on 12 June , 2024 </p>
      </div>
    </section>
  );
};

export default Settings;
