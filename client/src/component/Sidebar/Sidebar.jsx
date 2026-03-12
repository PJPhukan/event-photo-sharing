import React, { useContext, useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { context } from "../../../Context/context";
import LoadingButton from "../LoadingButton/LoadingButton";
import logo from "../../assets/logo.png";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    setIsLoggingOut(true);
    const response = await logout();
    setIsLoggingOut(false);
    if (response.success) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setadminlogin(false);
      navigate("/");
    }
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
        <div className="logo">
          <img src={logo} alt="Memois" />
          <div className="logo-copy">
            <div className="logo-mark">
              mem<span>ois</span>
            </div>
          </div>
        </div>
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
              location.pathname === "/dashboard/profile" || checkUrl("profile")
                ? "active"
                : " "
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
              location.pathname === "/dashboard/event" || checkUrl("event")
                ? "active"
                : " "
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
              location.pathname === "/dashboard/collections" ||
              checkUrl("collections")
                ? "active"
                : " "
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
              location.pathname === "/dashboard/favorite" ||
              checkUrl("favorite")
                ? "active"
                : " "
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
              location.pathname === "/dashboard/settings" ||
              checkUrl("settings")
                ? "active"
                : " "
            }`}
          >
            <li>
              <i className="bx bxs-cog"></i>
              <span>Settings</span>
            </li>
          </Link>
          <LoadingButton
            onClick={HandleLogout}
            loading={isLoggingOut}
            loadingText="Logging out"
          >
            <li className="logout">
              <i className="bx bx-log-out"></i>
              <span>Logout</span>
            </li>
          </LoadingButton>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
