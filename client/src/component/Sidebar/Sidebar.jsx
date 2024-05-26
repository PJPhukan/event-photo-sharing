import React, { useContext, useEffect, useState } from "react";
import "./sidebar.scss";
import { Link } from "react-router-dom";
import context from "../../../Context/context";
const Sidebar = () => {
  const usecontext = useContext(context);
  const { showSidebar } = usecontext;
  const [Showmobile, setShowmobile] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowmobile(true);
      } else {
        setShowmobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div
        className={`sidebar ${showSidebar ? "show" : "hide"} ${
          Showmobile ? "mobile-show" : ""
        }`}
      >
        <div className="logo">Memois</div>
        <div className="nav-item">
          <li>
            <Link to="/dashboard" className="active">
              <i className="bx bxs-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/profile">
              <i className="bx bxs-user"></i>
              <span>Profile</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/create-event">
              <i className="bx bxs-calendar-event"></i>
              <span>Events</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/collections">
              <i className="bx bx-collection"></i>
              <span>Collections</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/favorite">
              <i className="bx bxs-star"></i>
              <span>Favorites</span>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/notifications">
              <i className="bx bxs-bell"></i>
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <i className="bx bxs-cog"></i>
              <span>Settings</span>
            </Link>
          </li>
          <li className="logout">
            <Link to="/">
              <i className="bx bx-log-out"></i>
              <span>Logout</span>
            </Link>
          </li>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
