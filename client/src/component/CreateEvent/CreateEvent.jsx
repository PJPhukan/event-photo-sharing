import React, { useContext, useState } from "react";
import "./createevent.scss";
import { MdDescription } from "react-icons/md";
import { FiType } from "react-icons/fi";
import Logo from "../../assets/logo1.png";
import { context } from "../../../Context/context";
import { dashboad } from "../../../Context/context";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const UserContext = useContext(context);
  const DashboardContext = useContext(dashboad);
  const { setcreateEvent } = UserContext;
  const { create_event } = DashboardContext;
  const navigate = useNavigate();

  const [eventDetails, seteventDetails] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    type: "",
    contact: "",
  });

  const handleSubmit = async (e) => {
    const res = await create_event(eventDetails);
    // console.log("Print response datda:", res.data.data._id);
    setcreateEvent(false);
    navigate(`/dashboard/event/${res.data.data._id}`);
  };

  const onChange = (e) => {
    seteventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };
  return (
    <div className="create-event-main">
      <div className="main-content">
        <button className="close-button" onClick={() => setcreateEvent(false)}>
          <i className="bx bx-x"></i>
        </button>
        <div className="left content-item">
          <img src={Logo} alt="Memois" className="logo" />
          <h5 className="heading">Create Event</h5>
          <form method="post">
            <div className="input-item">
              <label htmlFor="event-name">
                <i className="bx bx-calendar-event"></i>
              </label>
              <input
                type="text"
                placeholder="Title"
                id="event-name"
                name="name"
                value={eventDetails.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-item">
              <label htmlFor="event-desc">
                <MdDescription />
              </label>
              <input
                type="text"
                placeholder="Description"
                id="event-desc"
                name="description"
                value={eventDetails.description}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-item">
              <label htmlFor="event-type">
                <FiType />
              </label>
              <select
                name="type"
                id="event-type"
                value={eventDetails.type}
                onChange={onChange}
                required
              >
                <option value="">--select type--</option>
                <option value="Wedding">Wedding</option>
                <option value="Convocation">Convocation</option>
                <option value="Marathon">Marathon</option>
                <option value="School">Schools</option>
                <option value="College">College</option>
                <option value="Social Club">Social Club</option>
                <option value="Corporate Event">Corporate Event</option>
              </select>
            </div>
            <div className="input-item">
              <label htmlFor="event-time">
                <i className="bx bx-time-five"></i>
              </label>
              <input
                type="datetime-local"
                placeholder="Date"
                id="event-time"
                name="date"
                value={eventDetails.date}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-item">
              <label htmlFor="event-location">
                <i className="bx bxs-location-plus"></i>
              </label>
              <input
                type="text"
                placeholder="Location"
                id="event-location"
                name="location"
                value={eventDetails.location}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-item">
              <label htmlFor="event-contact">
                <i className="bx bxs-contact"></i>
              </label>
              <input
                type="Number"
                placeholder="Contact"
                id="event-contact"
                name="contact"
                value={eventDetails.contact}
                onChange={onChange}
                required
              />
            </div>
          </form>
          <div className="btn-box">
            <button type="submit" className="sub-btn" onClick={handleSubmit}>
              Create Event
            </button>
          </div>
        </div>
        <div className="right content-item">
          <h5 className="text-hading">Hi</h5>
          <p className="user-name">&#129333;PJPhukan&#129333;</p>
          <p className="additional-text">
            Welcome! Please fill out the form below to create your event.
            Provide all necessary details to ensure a successful event.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
