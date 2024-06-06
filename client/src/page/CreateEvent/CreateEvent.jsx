import React from "react";
import EventCard from "../../component/EventCard/EventCard";
import './createevent.scss'
const CreateEvent = () => {
  return (
    <section className="create-event-main">
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
