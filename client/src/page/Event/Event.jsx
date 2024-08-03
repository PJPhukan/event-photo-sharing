import React, { useContext, useEffect, useState } from "react";
import EventCard from "../../component/EventCard/EventCard";
import "./event.scss";
import { context } from "../../../Context/context";
import { dashboad } from "../../../Context/context";
const CreateEvent = () => {
  const userContext = useContext(context);
  const { setcreateEvent } = userContext;
  const dashboardContext = useContext(dashboad);
  const { get_event } = dashboardContext;
  const [events, setevents] = useState([]);
  const handle_event = async () => {
    const res = await get_event();
    setevents(res.data.data);
  };
  useEffect(() => {
    handle_event();
  });

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
          Create Event
        </button>
      </div>
      <div className="event-main-content">
        {events.map((event) => {
          return <EventCard key={event._id} data={event}/>;
        })}
       
      </div>
    </section>
  );
};

export default CreateEvent;
