import React, { useContext, useEffect, useState } from "react";
import EventCard from "../../component/EventCard/EventCard";
import "./event.scss";
import { context } from "../../../Context/context";
import { dashboad } from "../../../Context/context";
import { useNavigate } from "react-router-dom";
import ProfileImg from "../../assets/collLogo.png";
import { APP_URL } from "../../lib/config";
const CreateEvent = () => {
  const userContext = useContext(context);
  const { setcreateEvent, seteditEvent, setdownloadQR } = userContext;
  const dashboardContext = useContext(dashboad);
  const { get_event, seteventId, setqrtext } = dashboardContext;
  const [events, setevents] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();
  const handle_event = async () => {
    const res = await get_event();
    setevents(res.data.data);
  };
  useEffect(() => {
    handle_event();
  }, []);

  const returnDate = (time) => {
    if (!time) return "-";
    const date = new Date(time);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = (eventId) => {
    navigate(`/dashboard/event/${eventId}`);
  };

  const handleEdit = (eventId) => {
    seteventId(eventId);
    seteditEvent(true);
  };

  const handleQrCode = (event) => {
    setqrtext(`${APP_URL}/event/${event.user_id}/${event._id}`);
    setdownloadQR(true);
  };

  return (
    <section className="event-main">
      <div className="top-event">
        <div className="section-heading">
          <div className="main-heading">Events</div>
          <div className="sub-heading">Manage your all events</div>
        </div>
        <div className="event-actions">
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
              type="button"
            >
              <i className="bx bx-grid-alt"></i>
              Grid
            </button>
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
              type="button"
            >
              <i className="bx bx-table"></i>
              Table
            </button>
          </div>
          <button
            className="create-event-btn"
            onClick={() => setcreateEvent(true)}
          >
            Create Event
          </button>
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="event-main-content">
          {events.map((event) => {
            return <EventCard key={event._id} data={event} />;
          })}
        </div>
      ) : (
        <div className="event-table">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Contact</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    <div className="event-cell">
                      <img
                        src={event.CoverImage || ProfileImg}
                        alt={event.EventName}
                      />
                      <div className="event-cell-text">
                        <span className="event-name">{event.EventName}</span>
                        <span className="event-sub">{event.EventType}</span>
                      </div>
                    </div>
                  </td>
                  <td>{event.EventType}</td>
                  <td>{event.EventLocation}</td>
                  <td>{returnDate(event.EventDate)}</td>
                  <td>{event.ContactDetails}</td>
                  <td>{returnDate(event.createdAt)}</td>
                  <td>
                    <div className="event-table-actions">
                      <button onClick={() => handleView(event._id)}>View</button>
                      <button onClick={() => handleEdit(event._id)}>Edit</button>
                      <button onClick={() => handleQrCode(event)}>QR</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CreateEvent;
