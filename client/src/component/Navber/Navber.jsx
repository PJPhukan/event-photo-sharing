import { useEffect, useRef, useState } from "react";
import "./navber.scss";
import logo from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/use-for", label: "Use Cases" },
  { to: "/testimonial", label: "Testimonials" },
  { to: "/faq", label: "FAQs" },
];

const isActivePath = (currentPath, itemPath) => {
  if (itemPath === "/") {
    return currentPath === "/";
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
};

const Navber = () => {
  const location = useLocation();
  const [showNav, setshowNav] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const desktopNavRef = useRef(null);
  const navShellRef = useRef(null);

  const toggleMenu = () => {
    setshowNav((current) => !current);
  };

  const closeMenu = () => {
    setshowNav(false);
  };

  useEffect(() => {
    const updateIndicator = () => {
      const navElement = desktopNavRef.current;
      if (!navElement) {
        return;
      }

      const activeLink = navElement.querySelector("a.active");
      if (!activeLink) {
        setIndicatorStyle({ opacity: 0 });
        return;
      }

      setIndicatorStyle({
        width: `${activeLink.offsetWidth}px`,
        height: `${activeLink.offsetHeight}px`,
        transform: `translateX(${activeLink.offsetLeft}px)`,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!showNav) {
        return;
      }

      if (navShellRef.current && !navShellRef.current.contains(event.target)) {
        setshowNav(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showNav]);

  return (
    <header className="navber">
      <div className="navber-content" ref={navShellRef}>
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Memois logo" />
          <div className="logo-copy">
            <div className="logo-text">
              mem<span>ois</span>
            </div>
            <div className="logo-subtext">Event photo sharing</div>
          </div>
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
          ref={desktopNavRef}
        >
          <span className="active-indicator" style={indicatorStyle}></span>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={isActivePath(location.pathname, item.to) ? "active" : ""}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="desktop-actions">
          <Link
            to="/login"
            state={{ redirectToCreateEvent: true }}
            className="desktop-create"
            onClick={closeMenu}
          >
            Create Event
          </Link>
          <Link to="/login" className="desktop-login" onClick={closeMenu}>
            Login
          </Link>
        </div>

        <div className="mobile-device">
          <Link to="/login" className="mobile-login" onClick={closeMenu}>
            Login
          </Link>
          <button
            type="button"
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={showNav ? "Close menu" : "Open menu"}
            aria-expanded={showNav}
          >
            <i className={`bx ${showNav ? "bx-x" : "bx-menu"} menuicon`}></i>
          </button>
        </div>

        <div className={`content ${showNav ? "active" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={isActivePath(location.pathname, item.to) ? "active" : ""}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            state={{ redirectToCreateEvent: true }}
            className="mobile-create"
            onClick={closeMenu}
          >
            Create Event
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navber;
