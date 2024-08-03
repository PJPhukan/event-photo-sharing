import React, { useContext } from "react";
import "./nofilefound.scss";
import { Link } from "react-router-dom";
import { FaExclamation } from "react-icons/fa";
import { context } from "../../../Context/context";
const NoFileFound = () => {
  const userContext = useContext(context);
  const { setcreateEvent } = userContext;
  return (
    <div className="no-event-found">
      <div className="no-event-icon-box">
        <FaExclamation />
      </div>
      <h2 className="no-event-text">No Such File Found! </h2>
      <div className="create-event">
        <button onClick={() => setcreateEvent(true)}> Create Event</button>
      </div>
    </div>
  );
};

export default NoFileFound;
