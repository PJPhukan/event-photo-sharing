import React from "react";
import EventCard from "../../component/EventCard/EventCard";
import "./event.scss";
import { Link } from "react-router-dom";
const CreateEvent = () => {
  return (
    <section className="create-event-main">
      <div className="top-event">
        <div className="section-heading">
          <div className="main-heading">Events</div>
          <div className="sub-heading">Manage your all events</div>
        </div>
        <Link to="/dashboard/create-event" className="create-event-btn"> Create Event</Link>
      </div>
      <div className="event-main-content">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </section>
  );
};

export default CreateEvent;
