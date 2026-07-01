import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./sidebar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { context } from "../../../Context/context";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const usercontext = useContext(context);
  const {
    showSidebar,
    setshowSidebar,
    showNotification,
    setshowNotification,
    user,
  } = usercontext;
  const [Showmobile, setShowmobile] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("memois_sidebar_collapsed") === "true";
  });
  const sidebarRef = useRef(null);
  let location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setShowmobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {}, [location]);

  useEffect(() => {
    if (!Showmobile) {
      setIsCollapsed(localStorage.getItem("memois_sidebar_collapsed") === "true");
    }
  }, [Showmobile]);

  useEffect(() => {
    if (Showmobile) return;
    localStorage.setItem("memois_sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed, Showmobile]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleExternalToggle = (event) => {
      if (Showmobile) return;
      if (typeof event?.detail === "boolean") {
        setIsCollapsed(event.detail);
      } else {
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("memois-sidebar-toggle", handleExternalToggle);
    return () => window.removeEventListener("memois-sidebar-toggle", handleExternalToggle);
  }, [Showmobile]);

  useEffect(() => {
    if (!showSidebar || !Showmobile) return;
    const handleOutsideClick = (event) => {
      if (!sidebarRef.current) return;
      if (!sidebarRef.current.contains(event.target)) {
        setshowSidebar(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [showSidebar, Showmobile, setshowSidebar]);

  const ToggleNotification = () => setshowNotification(!showNotification);

  const checkUrl = (str) => location.pathname.includes(`/${str}/`);

  const closeSidebarOnMobile = () => {
    if (Showmobile) setshowSidebar(false);
  };

  const handleBilling = () => navigate("/pricing");

  const normalizedPlan = useMemo(() => {
    const rawPlan =
      user?.plan?.name ||
      user?.subscription?.plan ||
      user?.planType ||
      user?.plan ||
      "Free";
    const planText = String(rawPlan).toLowerCase();
    if (planText.includes("pro")) return "Pro";
    if (planText.includes("event")) return "Event";
    return "Free";
  }, [user]);

  const planExpiry = useMemo(() => {
    const expiryValue =
      user?.subscription?.expiresAt ||
      user?.planExpiry ||
      user?.subscription?.expiryDate ||
      user?.subscription?.endsAt;
    if (!expiryValue) return "";
    const date = new Date(expiryValue);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [user]);

  return (
    <>
      {showSidebar && Showmobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setshowSidebar(false)}
          onTouchStart={() => setshowSidebar(false)}
        />
      )}
      <div
        ref={sidebarRef}
        className={`sidebar ${showSidebar ? "show" : "hide"} ${
          Showmobile ? "mobile-show" : ""
        } ${isCollapsed && !Showmobile ? "collapsed" : ""}`}
      >
        {/* LOGO */}
        <div className="logo">
          <div className="logo-mark">
            <img src={logo} alt="Memois" />
            <div className="logo-copy">
              <div className="logo-text">
                mem<span>ois</span>
              </div>
            </div>
          </div>
          {Showmobile && (
            <button
              className="sidebar-close"
              onClick={() => setshowSidebar(false)}
              type="button"
            >
              <i className="bx bx-x"></i>
            </button>
          )}
        </div>

        {/* NAV LINKS */}
        <div className="nav-item">
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Dashboard"
            >
              <li>
                <i className="bx bxs-dashboard"></i>
                <span>Dashboard</span>
              </li>
            </Link>

            <Link
              to="/dashboard/profile"
              className={`nav-link ${
                location.pathname === "/dashboard/profile" || checkUrl("profile") ? "active" : ""
              }`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Profile"
            >
              <li>
                <i className="bx bxs-user"></i>
                <span>Profile</span>
              </li>
            </Link>

<<<<<<< HEAD
          <Link
            to="/dashboard/event"
            className={`${
              location.pathname === "/dashboard/event" || checkUrl("event")
                ? "active"
                : " "
            }`}
            onClick={closeSidebarOnMobile}
          >
            <li>
              <i className="bx bxs-calendar-event"></i>
              <span>Events</span>
            </li>
          </Link>
          <Link
            to="/dashboard/card-builder"
            className={`${
              location.pathname === "/dashboard/card-builder"
                ? "active"
                : " "
            }`}
            onClick={closeSidebarOnMobile}
          >
            <li>
              <i className="bx bx-paint-roll"></i>
              <span>Card Builder</span>
            </li>
          </Link>
=======
            <Link
              to="/dashboard/event"
              className={`nav-link ${
                location.pathname === "/dashboard/event" || checkUrl("event") ? "active" : ""
              }`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Events"
            >
              <li>
                <i className="bx bxs-calendar-event"></i>
                <span>Events</span>
              </li>
            </Link>
>>>>>>> 2f2a657ec19eb87430f80d3ea6cb07855f1723e5

            <Link
              to="/dashboard/event-card-builder"
              className={`nav-link ${
                location.pathname === "/dashboard/event-card-builder" ||
                checkUrl("event-card-builder")
                  ? "active"
                  : ""
              }`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Event Card Builder"
            >
              <li>
                <i className="bx bx-id-card"></i>
                <span>Event Card Builder</span>
              </li>
            </Link>

            <Link
              to="/dashboard/collections"
              className={`nav-link ${
                location.pathname === "/dashboard/collections" || checkUrl("collections")
                  ? "active"
                  : ""
              }`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Collections"
            >
              <li>
                <i className="bx bx-collection"></i>
                <span>Collections</span>
              </li>
            </Link>

<<<<<<< HEAD
          <button
            onClick={() => {
              ToggleNotification();
              closeSidebarOnMobile();
            }}
          >
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
            onClick={closeSidebarOnMobile}
          >
            <li>
              <i className="bx bxs-cog"></i>
              <span>Settings</span>
            </li>
          </Link>

          {/* Subscription — not implemented yet
          <button onClick={closeSidebarOnMobile}>
            <li>
              <i className="bx bxs-crown"></i>
              <span>Subscription</span>
            </li>
          </button>
          */}
=======
            <Link
              to="/dashboard/favorite"
              className={`nav-link ${
                location.pathname === "/dashboard/favorite" || checkUrl("favorite")
                  ? "active"
                  : ""
              }`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Favorites"
            >
              <li>
                <i className="bx bxs-star"></i>
                <span>Favorites</span>
              </li>
            </Link>

            <button
              className="nav-link"
              onClick={() => {
                ToggleNotification();
                closeSidebarOnMobile();
              }}
              data-tooltip="Notifications"
              type="button"
            >
              <li>
                <i className="bx bxs-bell"></i>
                <span>Notifications</span>
              </li>
            </button>

            <Link
              to="/dashboard/settings"
              className={`nav-link ${
                location.pathname === "/dashboard/settings" || checkUrl("settings")
                  ? "active"
                  : ""
              }`}
              onClick={closeSidebarOnMobile}
              data-tooltip="Settings"
            >
              <li>
                <i className="bx bxs-cog"></i>
                <span>Settings</span>
              </li>
            </Link>

            <Link
              to="/dashboard/support"
              className="nav-link"
              onClick={closeSidebarOnMobile}
              data-tooltip="Help & Support"
            >
              <li>
                <i className="bx bx-help-circle"></i>
                <span>Help & Support</span>
              </li>
            </Link>
>>>>>>> 2f2a657ec19eb87430f80d3ea6cb07855f1723e5
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="sidebar-bottom">
        

          <div className="plan-block" data-tooltip={`${normalizedPlan} Plan`}>
            <button
              className="plan-header"
              type="button"
              onClick={handleBilling}
            >
              
              {normalizedPlan !== "Free" && (
                <div className="plan-text">
                  <div className="plan-label">
                    {normalizedPlan === "Pro" ? "Pro Plan" : "Event Plan"}
                  </div>
                  <div className="plan-subtext">
                    {planExpiry ? `Expires ${planExpiry}` : "Renews monthly"}
                  </div>
                </div>
              )}
            </button>
            {normalizedPlan === "Free" && (
              <button
                type="button"
                className="plan-upgrade-button"
                onClick={handleBilling}
              >
                <i className="bx bx-rocket"></i>
                <span className="upgrade-text">Upgrade</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
