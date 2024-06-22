import React, { useContext, useEffect, useState } from "react";
import "./profile.scss";
import coverImage from "../../assets/coverImage.jpeg";
import AvatarImg from "../../assets/profile.jpg";
import context from "../../../Context/context";

const Profile = () => {
  const UserContext = useContext(context);
  const { getuser, user, ChangeAvatar, ChangeCoverImage, UpdateUserDetails } =
    UserContext;
  const [avatarImg, setAvatarImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const [initialized, setInitialized] = useState(false);

  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => {
    getuser();
  }, [getuser]);

  const [euser, seteuser] = useState({
    eusername: "",
    ename: "",
    emobile: "",
    eemail: "",
    ebio: "",
  });

  useEffect(() => {
    if (user && !initialized) {
      seteuser({
        eusername: user.username || "",
        ename: user.fullname || "",
        emobile: user.phoneNumber || "",
        eemail: user.email || "",
        ebio: user.bio || "",
      });

      setInitialized(true); // Mark form as initialized
    }
    setFullname(user?.fullname);
    setBio(user?.bio || "");
  }, [user, initialized]);

  const Onchange = (e) => {
    seteuser({ ...euser, [e.target.name]: e.target.value });
  };

  const ChangeUserAvatar = async (e) => {
    const file = e.target.files[0];
    setAvatarImg(file);
    const formdata = new FormData();
    formdata.append("avatar", file);
    await ChangeAvatar(formdata);
  };

  const ChangeUserCoverImg = async (e) => {
    const file = e.target.files[0];
    setCoverImg(file);
    const formdata = new FormData();
    formdata.append("coverImg", file);
    await ChangeCoverImage(formdata);
  };

  const UpdateDetails = async (e) => {
    e.preventDefault();
    await UpdateUserDetails(euser);
    console.log("User update successfully");
  };
  return (
    <section className="profile">
      <div className="profile-content">
        <div className="cover-image">
          <label htmlFor="edit-cover">
            <i className="bx bxs-camera"></i>
            <span>Edit Cover Photo</span>
          </label>
          <input
            type="file"
            id="edit-cover"
            name="Coverfile"
            onChange={ChangeUserCoverImg}
          />
          <img src={user?.coverImage ? user.coverImage : coverImage} alt="" />
        </div>

        <div className="user-details">
          <div className="avatar">
            <img src={user?.avatar ? user.avatar : AvatarImg} alt="" />
            <label htmlFor="edit-avatar">
              <i className="bx bxs-camera"></i>
            </label>
            <input type="file" id="edit-avatar" onChange={ChangeUserAvatar} />
          </div>
          <div className="details">
            <div className="fullname">{fullname}</div>
            <div className="bio">{bio}</div>
          </div>
        </div>

        <div className="user-details-update">
          <div className="user-details-heading">Profile Information</div>
          <div className="user-sub-heading">Manage your account</div>
          <form method="post">
            <div className="row-box">
              <div className="user-details-box">
                <div className="user-title">
                  <i className="bx bxs-user"></i>
                  <span>Username</span>
                </div>
                <input
                  type="text"
                  name="eusername"
                  value={euser.eusername}
                  onChange={Onchange}
                />
              </div>
              <div className="user-details-box">
                <div className="user-title">
                  <i className="bx bx-rename"></i>
                  <span>Name</span>
                </div>
                <input
                  type="text"
                  name="ename"
                  value={euser.ename}
                  onChange={Onchange}
                />
              </div>
            </div>

            <div className="row-box">
              <div className="user-details-box">
                <div className="user-title">
                  <i className="bx bxs-phone"></i>
                  <span>Phone Number</span>
                </div>
                <input
                  type="Number"
                  name="emobile"
                  value={euser.emobile}
                  onChange={Onchange}
                />
              </div>
              <div className="user-details-box">
                <div className="user-title">
                  <i className="bx bxs-envelope"></i>
                  <span>Email</span>
                </div>
                <input
                  type="text"
                  name="eemail"
                  value={euser.eemail}
                  onChange={Onchange}
                />
              </div>
            </div>

            <div className="row-box">
              <div className="user-details-box">
                <div className="user-title">
                  <i className="bx bx-user-circle"></i>
                  <span>Bio</span>
                </div>
                <textarea
                  name="ebio"
                  id="bio"
                  rows="5"
                  type="text"
                  value={euser.ebio}
                  onChange={Onchange}
                ></textarea>
              </div>
            </div>
            <div className="btn">
              <input
                type="submit"
                value="Edit Your Profile"
                // onSubmit={UpdateDetails}
                onClick={UpdateDetails}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
