import React, { useContext, useEffect, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import context from "../../../Context/context";
const Sidebar = () => {
  const navigate = useNavigate();
  const usecontext = useContext(context);
  const { showSidebar, logout, setadminlogin } = usecontext;
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
              location.pathname === "/dashboard/profile" ? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-user"></i>
              <span>Profile</span>
            </li>
          </Link>

          <Link
            to="/dashboard/create-event"
            className={`${
              location.pathname === "/dashboard/create-event" ? "active" : " "
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
              location.pathname === "/dashboard/collections" ? "active" : " "
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
              location.pathname === "/dashboard/favorite" ? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-star"></i>
              <span>Favorites</span>
            </li>
          </Link>

          <Link
            to="/dashboard/notifications"
            className={`${
              location.pathname === "/dashboard/notifications" ? "active" : " "
            }`}
          >
            <li>
              <i className="bx bxs-bell"></i>
              <span>Notifications</span>
            </li>
          </Link>
          <Link
            to="/dashboard/settings"
            className={`${
              location.pathname === "/dashboard/settings" ? "active" : " "
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
