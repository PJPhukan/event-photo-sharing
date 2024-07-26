import React, { useContext, useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import context from "../../../Context/context";
const Sidebar = () => {
  const navigate = useNavigate();
  const usercontext = useContext(context);
  const {
    showSidebar,
    logout,
    setadminlogin,
    showNotification,
    setshowNotification,
  } = usercontext;
  const [Showmobile, setShowmobile] = useState(true);
  let location = useLocation();
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
  useEffect(() => {}, [location]);

  const HandleLogout = async () => {
    await logout();
    setadminlogin(false);
    navigate("/");
  };

  const ToggleNotification = () => {
    setshowNotification(!showNotification);
  };

  const checkUrl = (str) => {
    return location.pathname.includes(`/${str}/`);
  };
  return (
    <>
      <div
        className={`sidebar ${showSidebar ? "show" : "hide"} ${
          Showmobile ? "mobile-show" : ""
        }`}
      >
        <div className="logo">Memois</div>
        <div className="nav-item">
          <Link
            to="/"
            className={`${location.pathname === "/" ? "active" : " "}`}
          >
            <li>
              <i className="bx bxs-dashboard"></i>
              <span>Dashboard</span>
            </li>
          </Link>

          <Link
            to="/dashboard/profile"
            className={`${
              location.pathname === "/dashboard/profile" || checkUrl("profile")? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-user"></i>
              <span>Profile</span>
            </li>
          </Link>

          <Link
            to="/dashboard/event"
            className={`${
              location.pathname === "/dashboard/event" || checkUrl("event")? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-calendar-event"></i>
              <span>Events</span>
            </li>
          </Link>

          <Link
            to="/dashboard/collections"
            className={`${
              location.pathname === "/dashboard/collections" || checkUrl("collections") ? "active" : " "
            }`}
          >
            <li>
              <i className="bx bx-collection"></i>
              <span>Collections</span>
            </li>
          </Link>

          <Link
            to="/dashboard/favorite"
            className={`${
              location.pathname === "/dashboard/favorite" || checkUrl("favorite") ? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-star"></i>
              <span>Favorites</span>
            </li>
          </Link>

          <button onClick={ToggleNotification}>
            <li>
              <i className="bx bxs-bell"></i>
              <span>Notifications</span>
            </li>
          </button>
          <Link
            to="/dashboard/settings"
            className={`${
              location.pathname === "/dashboard/settings" || checkUrl("settings") ? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-cog"></i>
              <span>Settings</span>
            </li>
          </Link>
          <button onClick={HandleLogout}>
            <li className="logout">
              <i className="bx bx-log-out"></i>
              <span>Logout</span>
            </li>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
