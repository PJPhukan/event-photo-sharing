import React, { useContext, useEffect } from "react";
import "./topbar.scss";
import ProfileImage from "../../assets/profile.jpg";
import { Link } from "react-router-dom";
import context from "../../../Context/context";
import Notification from "../Notification/Notification";
const Topbar = () => {
  const UserContext = useContext(context);
  const {
    showSidebar,
    setshowSidebar,
    user,
    showNotification,
    setshowNotification,
  } = UserContext;
  useEffect(() => {}, [user]);
  const ToggleNotification = () => {
    setshowNotification(!showNotification);
  };
  return (
    <div className="top-bar">
      <div className="left">
        <i
          className="bx bx-menu"
          onClick={() => setshowSidebar(!showSidebar)}
        ></i>
        <div className="search">
          <input type="text" placeholder="Search" />
          <i className="bx bx-search-alt-2"></i>
        </div>
      </div>
      <div className="right">
        <Link to="/dashboard/uploads" className="icon">
          {/* <i className="bx bxs-image-add"></i> */}
          <i className="bx bx-plus"></i>
        </Link>
        <i className="bx bxs-bell" onClick={ToggleNotification}></i>

        <Link to="/dashboard/profile" className="ProfileImage">
          <img src={user ? user.avatar : ProfileImage} alt="" />
        </Link>
      </div>
      <Notification />
    </div>
  );
};

export default Topbar;
