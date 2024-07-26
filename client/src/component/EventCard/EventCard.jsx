import React, { useState, useRef, useEffect, useContext } from "react";
import "./eventcard.scss";
import { Link } from "react-router-dom";
import ProfileImg from "../../assets/collLogo.png";
import { MdDelete } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import context from "../../../Context/context";
const EventCard = () => {
  const [showEventPopUP, setshowEventPopUP] = useState(false);
  const { seteditEvent, downloadQR, setdownloadQR } = useContext(context);
  //TODO:Edit Details of the event
  const EditDetailsEvent = () => {
    console.log("Edit Details button was clicked");
  };

  //TODO:Delete event
  const DeleteEvent = () => {
    console.log("Delete Event button was clicked");
  };

  const getSubstring = (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + "...";
    }
    return str;
  };
  return (
    <div className="event-card">
      <div className="top-box">
        <div className="event-card-box">
          <img src={ProfileImg} alt="" className="event-logo" />
          <div className="top-text">
            <h4 className="event-name">
              {getSubstring("College annual function", 10)}
            </h4>
            <h5 className="event-type">Marrage</h5>
          </div>
        </div>
        <Link to="/dashboard/event/2" className="btn-view">
          <FaRegEye />
          View
        </Link>
      </div>
      <p className="event-description">
        {getSubstring(
          "Discover a curated collection of stunning images perfect for enhancingyour creative endeavors. High-quality, versatile, and ready to inspire.",
          50
        )}
      </p>

      <div className="details-box">
        <div className="contact-details-item">
          <i className="bx bx-map"></i>
          <span>Maligoan, Guwahati, Assam, India</span>
        </div>
        <div className="contact-details-item">
          <i className="bx bx-calendar"></i>
          <span>12 pm , 25 June ,2024</span>
        </div>
        <div className="contact-details-item">
          <i className="bx bx-phone"></i>
          <span>
            <span className="country-code">+91</span>
            <span>7002925194</span>
          </span>
        </div>
      </div>
      <div className="time-details">
        <p className="created-time">
          Created was <span className="show-time"> 12:00 pm</span>, 12 Jun ,
          2024
        </p>
        <button
          className="view-more"
          onClick={() => setshowEventPopUP(!showEventPopUP)}
        >
          <i className="bx bx-dots-vertical"></i>
        </button>

        <div
          className={`pop-up-model ${
            showEventPopUP ? "active-event-pop-up" : ""
          }`}
        >
          <button
            className="cross-icon"
            onClick={() => setshowEventPopUP(false)}
          >
            <i className="bx bx-x"></i>
          </button>
          <button className="pop-up-item" onClick={() => seteditEvent(true)}>
            <i className="bx bx-edit-alt"></i>
            <span>Edit Details</span>
          </button>
          <button className="pop-up-item" onClick={() => setdownloadQR(true)}>
            <i className="bx bx-qr"></i>
            <span>QR Code</span>
          </button>
          <button className="pop-up-item" onClick={DeleteEvent}>
            <MdDelete />
            <span>Delete Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
