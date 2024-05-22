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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
              quidem, amet nisi ratione accusamus quam ad! veniam animi!
            </div>
          </div>
          <div className="col">
            <div className="title">Contact</div>
            <div className="c-content">
              <FaLocationArrow />
              <div className="text">
               New Delhi, India ,7002020
              </div>
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
            <span className="text">Weddings</span>
            <span className="text">Private Events</span>
            <span className="text">College Events</span>
            <span className="text">Sporting Events</span>
            <span className="text">Social Clubs</span>
            <span className="text">Corporate Events</span>
          </div>
          <div className="col">
            <div className="title">Quick Links</div>
            <span className="text">
              <Link to="">Home</Link>
            </span>
            <span className="text">
              <Link to="">About</Link>
            </span>
            <span className="text">
              <Link to="">Privacy Policy</Link>
            </span>
            <span className="text">
              <Link to="">Returns</Link>
            </span>
            <span className="text">
              <Link to="">Terns & Conditions</Link>
            </span>
            <span className="text">
              <Link to="">Contact Us</Link>
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
