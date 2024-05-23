import React from "react";
import "./footer.scss";
import { FaMobileAlt, FaLocationArrow, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="col">
            <div className="title">About</div>
            <div className="text">
            Mêmois is your go-to platform for capturing and sharing life's special moments effortlessly. With user-friendly features like easy album creation, collaborative sharing, and customizable privacy settings, Mêmois ensures your memories are safely stored and shared with loved ones. Plus, our advanced face recognition technology adds an extra layer of convenience by helping you organize and identify individuals in your photos and videos. Join Mêmois today to preserve and cherish every moment with ease and joy.
            </div>
          </div>
          <div className="col">
            <div className="title">Contact</div>
            <div className="c-content">
              <FaLocationArrow />
              <div className="text">New Delhi, India ,7002020</div>
            </div>
            <div className="c-content">
              <FaMobileAlt />
              <div className="text">Phone:+91 2839 2390 12</div>
            </div>
            <div className="c-content">
              <FaEnvelope />
              <div className="text">Email:memois2024@gmail.com</div>
            </div>
          </div>
          <div className="col">
            <div className="title">Use Cases</div>
            <span className="text"><Link to="/wedding">Weddings</Link></span>
            <span className="text"><Link to="/private-event">Private Events</Link></span>
            <span className="text"><Link to="/college">College Events</Link></span>
            <span className="text"><Link to="/sports">Sporting Events</Link></span>
            <span className="text"><Link to="/club">Social Clubs</Link></span>
            <span className="text"><Link to="/corporate">Corporate Events</Link></span>
          </div>
          <div className="col">
            <div className="title">Quick Links</div>
            <span className="text">
              <Link to="/">Home</Link>
            </span>
            <span className="text">
              <Link to="/about">About</Link>
            </span>
            <span className="text">
              <Link to="/use-for">Use for</Link>
            </span>
            <span className="text">
              <Link to="/privacy-policy">Privacy Policy</Link>
            </span>
            <span className="text">
              <Link to="/terms-conditions">Terns & Conditions</Link>
            </span>
            <span className="text">
              <Link to="/faq">FAQ</Link>
            </span>
          </div>
          <div className="bottom-bar">
            <div className="text">
              © Memois Pvt. limited. All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
