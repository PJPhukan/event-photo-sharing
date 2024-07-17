import React, { useState, useRef, useEffect } from "react";
import "./eventcard.scss";
import { GiLoveLetter } from "react-icons/gi";
import { Link } from "react-router-dom";
import ProfileImg from "../../assets/collLogo.png";
import { MdDelete } from "react-icons/md";
const EventCard = () => {
  const [showEventPopUP, setshowEventPopUP] = useState(false);

  //TODO:Edit Details of the event
  const EditDetailsEvent = () => {
    console.log("Edit Details button was clicked");
  };

  //TODO:Change avatar of the event
  const ChangeAvatarEvent = () => {
    console.log("Change Avatar Event button was clicked");
  };

  //TODO:Delete event
  const DeleteEvent = () => {
    console.log("Delete Event button was clicked");
  };
  return (
    <div className="event-card">
      <div className="top-box">
        <img src={ProfileImg} alt="" className="event-logo" />
        <div className="top-text">
          <h4 className="event-name">Event name</h4>
          <h5 className="event-type">Marrage</h5>
        </div>
      </div>
      <p className="event-description">
        Discover a curated collection of stunning images perfect for enhancing
        your creative endeavors. High-quality, versatile, and ready to inspire.
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
          <button className="pop-up-item" onClick={EditDetailsEvent}>
            <i className="bx bx-edit-alt"></i>
            <span>Edit Details</span>
          </button>
          <button className="pop-up-item" onClick={ChangeAvatarEvent}>
            <i className="bx bxs-camera"></i>
            <span>Change Avatar</span>
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
