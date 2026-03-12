import React, { useContext, useEffect, useState } from "react";
import "./profile.scss";
import { context } from "../../../Context/context";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const Profile = () => {
  const UserContext = useContext(context);
  const { getuser, user, ChangeAvatar, ChangeCoverImage, UpdateUserDetails } =
    UserContext;
  const [avatarImg, setAvatarImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");

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
    if (!file) {
      return;
    }
    setLoadingAction("avatar");
    setAvatarImg(file);
    const formdata = new FormData();
    formdata.append("avatar", file);
    await ChangeAvatar(formdata);
    setLoadingAction("");
  };

  const ChangeUserCoverImg = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setLoadingAction("cover");
    setCoverImg(file);
    const formdata = new FormData();
    formdata.append("coverImg", file);
    await ChangeCoverImage(formdata);
    setLoadingAction("");
  };

  const UpdateDetails = async (e) => {
    e.preventDefault();
    setLoadingAction("profile");
    await UpdateUserDetails(euser);
    setLoadingAction("");
  };

  const emailOnchange = () => {};
  return (
    user && (
      <section className="profile">
        <div className="profile-content">
          <div className="cover-image">
            <label htmlFor="edit-cover">
              <i className="bx bxs-camera"></i>
              <span>
                {loadingAction === "cover" ? "Uploading cover..." : "Edit Cover Photo"}
              </span>
            </label>
            <input
              type="file"
              id="edit-cover"
              name="Coverfile"
              onChange={ChangeUserCoverImg}
            />
            <img src={user?.coverImage } alt="" />
          </div>

          <div className="user-details">
            <div className="avatar">
              <img src={user?.avatar} alt="" />
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
                    name=""
                    value={user?.email || ""}
                    onChange={emailOnchange}
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
                <LoadingButton
                  type="submit"
                  loading={loadingAction === "profile"}
                  loadingText="Saving profile"
                  onClick={UpdateDetails}
                >
                  Edit Your Profile
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  );
};

export default Profile;
