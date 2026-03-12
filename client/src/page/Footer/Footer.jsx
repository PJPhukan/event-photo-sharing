import React from "react";
import "./footer.scss";
import { FaMobileAlt, FaLocationArrow, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer
      className="footer"
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
    >
      <div className="footer-content">
        <div className="footer-top">
          <div className="brand-col">
            <div className="brand-head">
              <div className="brand-identity">
                <img src={logo} alt="Memois logo" />
                <div className="brand-mark">
                  mem<span>ois</span>
                </div>
              </div>
              <div className="brand-subtext">Event photo sharing</div>
            </div>
            <div className="brand-text">
              Private event galleries with face-based discovery, smoother guest access,
              and cleaner sharing for hosts.
            </div>
            <div className="brand-actions">
              <Link to="/login" state={{ redirectToCreateEvent: true }}>
                Create Event
              </Link>
              <Link to="/about" className="secondary-link">
                Know More
              </Link>
            </div>
          </div>

          <div className="links-col">
            <div className="title">Contact</div>
            <div className="c-content">
              <FaLocationArrow />
              <div className="text">Guwahati Assam, India</div>
            </div>
            <div className="c-content">
              <FaMobileAlt />
              <div className="text">Phone: +91 7002 9251 94</div>
            </div>
            <div className="c-content">
              <FaEnvelope />
              <div className="text">Email: support@memois.com</div>
            </div>
          </div>

          <div className="links-col">
            <div className="title">Use Cases</div>
            <Link className="text" to="/use-for/weddings">Weddings</Link>
            <Link className="text" to="/use-for/convocations">Convocations</Link>
            <Link className="text" to="/use-for/marathons-cyclothons">Marathons</Link>
            <Link className="text" to="/use-for/schools-colleges">Schools & Colleges</Link>
            <Link className="text" to="/use-for/social-clubs">Social Clubs</Link>
            <Link className="text" to="/use-for/corporate-events">Corporate Events</Link>
          </div>

          <div className="links-col">
            <div className="title">Quick Links</div>
            <Link className="text" to="/">Home</Link>
            <Link className="text" to="/about">About</Link>
            <Link className="text" to="/use-for">Use Cases</Link>
            <Link className="text" to="/faq">FAQs</Link>
            <Link className="text" to="/privacy-policy">Privacy Policy</Link>
            <Link className="text" to="/terms-conditions">Terms & Conditions</Link>
          </div>

          <div className="links-col">
            <div className="title">Product</div>
            <div className="text">Private sharing</div>
            <div className="text">Face recognition</div>
            <div className="text">Photo and video delivery</div>
            <div className="text">Event-first experience</div>
          </div>
        </div>

        <div className="bottom-bar">
          <div className="text">© Memois Pvt. Limited. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
