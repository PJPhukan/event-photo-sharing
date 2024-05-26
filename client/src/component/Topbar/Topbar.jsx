import React, { useContext } from "react";
import "./topbar.scss";
import ProfileImage from "../../assets/profile.jpg";
import { Link } from "react-router-dom";
import context from "../../../Context/context";
const Topbar = () => {
  const usecontext = useContext(context);
  const { showSidebar, setshowSidebar } = usecontext;

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
        <Link to="/dashboard/uploads">
          {/* <i className="bx bxs-image-add"></i> */}
          <i className="bx bx-plus"></i>
        </Link>
        <Link to="/dashboard/notifications" className="icon">
          <i className="bx bxs-bell"></i>
        </Link>

        <Link to="/dashboard/profile">
          <img src={ProfileImage} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
