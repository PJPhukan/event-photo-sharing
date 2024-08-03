import React, { useState, useRef, useEffect, useContext } from "react";
import "./eventcard.scss";
import { Link } from "react-router-dom";
import ProfileImg from "../../assets/collLogo.png";
import { MdDelete } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { context } from "../../../Context/context";
import { dashboad } from "../../../Context/context";
const EventCard = ({ data }) => {
  const [showEventPopUP, setshowEventPopUP] = useState(false);
  const { seteditEvent, downloadQR, setdownloadQR } = useContext(context);
  const DashboardContext = useContext(dashboad);
  const { delete_event, setqrtext } = DashboardContext;

  //TODO:Edit Details of the event
  const EditDetailsEvent = () => {
    console.log("Edit Details button was clicked");
  };

  const DeleteEvent = async () => {
    const res = await delete_event(data._id);
    // console.log(res.data.success);
  };

  const getSubstring = (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + "...";
    }
    return str;
  };

  const returnTimeDate = (time) => {
    const date = new Date(time);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);
    const [datePart, timePart] = formattedDate.split(", ");
    const [hour, minute] = timePart.split(":");
    const customFormattedDate = `${hour}:${minute}, ${datePart}`;
    return customFormattedDate;
  };

  const handleQRCode = () => {
    setqrtext(`http://localhost:5173/event/${data.user_id}/${data._id}`);
    setdownloadQR(true);
  };
  return (
    <div className="event-card">
      <div className="top-box">
        <div className="event-card-box">
          <img
            src={data.CoverImage ? data.CoverImage : ProfileImg}
            alt=""
            className="event-logo"
          />
          <div className="top-text">
            <h4 className="event-name">
              {getSubstring(`${data.EventName}`, 10)}
            </h4>
            <h5 className="event-type">{data.EventType}</h5>
          </div>
        </div>
        <Link to={`/dashboard/event/${data._id}`} className="btn-view">
          <FaRegEye />
          View
        </Link>
      </div>
      <p className="event-description">
        {getSubstring(`${data.EventDescription}`, 50)}
      </p>

      <div className="details-box">
        <div className="contact-details-item">
          <i className="bx bx-map"></i>
          <span>{data.EventLocation}</span>
        </div>
        <div className="contact-details-item">
          <i className="bx bx-calendar"></i>
          <span>{returnTimeDate(data.EventDate)}</span>
        </div>
        <div className="contact-details-item">
          <i className="bx bx-phone"></i>
          <span>
            <span className="country-code">+91</span>
            <span>{data.ContactDetails}</span>
          </span>
        </div>
      </div>
      <div className="time-details">
        <p className="created-time">
          Created was {returnTimeDate(data.createdAt)}
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
          <button className="pop-up-item" onClick={handleQRCode}>
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
