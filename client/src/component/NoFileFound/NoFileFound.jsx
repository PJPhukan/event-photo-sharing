import React from "react";
import "./nofilefound.scss";
import { Link } from "react-router-dom";
import { FaExclamation } from "react-icons/fa";
const NoFileFound = () => {
  return (
    <div className="no-event-found">
      <div className="no-event-icon-box">
        <FaExclamation />
      </div>
      <h2 className="no-event-text">No Such File Found! </h2>
      <Link to="/dashboard/create-event" className="create-event-btn">
        Create Event
      </Link>
    </div>
  );
};

export default NoFileFound;
