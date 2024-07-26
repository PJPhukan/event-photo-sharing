import React, { useContext } from "react";
import EventCard from "../../component/EventCard/EventCard";
import "./event.scss";
import context from "../../../Context/context";
const CreateEvent = () => {
  const userContext = useContext(context);
  const { setcreateEvent } = userContext;
  return (
    <section className="event-main">
      <div className="top-event">
        <div className="section-heading">
          <div className="main-heading">Events</div>
          <div className="sub-heading">Manage your all events</div>
        </div>
        <button
          className="create-event-btn"
          onClick={() => setcreateEvent(true)}
        >
          {" "}
          Create Event
        </button>
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
