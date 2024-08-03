import "./editevent.scss";
import React, { useContext, useEffect, useState } from "react";
import { MdDescription } from "react-icons/md";
import { FiType } from "react-icons/fi";
import Logo from "../../assets/logo1.png";
import { context, dashboad } from "../../../Context/context";

const EditEvent = () => {
  const { seteditEvent } = useContext(context);
  const dashboardContext = useContext(dashboad);
  const { get_event_details, eventId, event_data } = dashboardContext;

  useEffect(() => {
    const get_details = async () => {
      const result = await get_event_details(eventId);
      return result.data?.data?.event_details[0];
    };
    const response = get_details();
  }, []);

  const [initialized, setinitialized] = useState(false);
  const [eevent, setEevent] = useState({
    ename: "",
    edescription: "",
    edate: "",
    elocation: "",
    etype: "",
    econtact: "",
  });
  useEffect(() => {
    if (event_data && !initialized) {
      setEevent({
        ename: event_data?.EventName || "",
        edescription: event_data?.EventDescription || "",
        edate: event_data?.EventDate || "",
        elocation: event_data?.EventLocation || "",
        etype: event_data?.EventType || "",
        econtact: event_data?.ContactDetails || "",
      });
      setinitialized(true);
    }
  }, [event_data, initialized]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO: send data to the backend and navigate to that page
    console.log("Submitting event details");
    console.log(eevent);
  };

  const Onchange = (e) => {
    setEevent({ ...eevent, [e.target.name]: e.target.value });
  };
  //TODO: send data to the backend and navigate to that page
  return (
    event_data && (
      <div className="edit-event-main">
        <div className="main-content">
          <button className="close-button" onClick={() => seteditEvent(false)}>
            <i className="bx bx-x"></i>
          </button>
          <div className="content-item">
            <img src={Logo} alt="Memois" className="logo" />
            <h5 className="heading">Change Event Details</h5>
            <form method="post">
              <div className="input-item">
                <label htmlFor="event-name">
                  <i className="bx bx-calendar-event"></i>
                </label>
                <input
                  type="text"
                  placeholder={eevent.ename}
                  id="event-name"
                  name="ename"
                  value={eevent.ename}
                  onChange={Onchange}
                />
              </div>
              <div className="input-item">
                <label htmlFor="event-desc">
                  <MdDescription />
                </label>
                <input
                  type="text"
                  placeholder={eevent.edescription}
                  id="event-desc"
                  name="edescription"
                  value={eevent.edescription}
                  onChange={Onchange}
                />
              </div>
              <div className="input-item">
                <label htmlFor="event-type">
                  <FiType />
                </label>
                <select
                  name="etype"
                  id="event-type"
                  onChange={Onchange}
                  value={eevent.etype}
                >
                  <option value="Wedding">{eevent.etype}</option>
                  <option value="Convocation">Convocation</option>
                  <option value="Marathon">Marathon</option>
                  <option value="School">Schools</option>
                  <option value="College">College</option>
                  <option value="Social Club">Social Club</option>
                  <option value="Corporate Event">Corporate Event </option>
                </select>
              </div>
              <div className="input-item">
                <label htmlFor="event-time">
                  <i className="bx bx-time-five"></i>
                </label>
                <input
                  type="datetime-local"
                  placeholder={eevent.edate}
                  id="event-time"
                  name="edate"
                  onChange={Onchange}
                  value={eevent.edate}
                />
              </div>
              <div className="input-item">
                <label htmlFor="event-location">
                  <i className="bx bxs-location-plus"></i>
                </label>
                <input
                  type="text"
                  placeholder={eevent.elocation}
                  id="event-location"
                  name="elocation"
                  value={eevent.elocation}
                  onChange={Onchange}
                />
              </div>
              <div className="input-item">
                <label htmlFor="event-contact">
                  <i className="bx bxs-contact"></i>
                </label>
                <input
                  type="Number"
                  placeholder={eevent.econtact}
                  id="event-contact"
                  value={eevent.econtact}
                  name="econtact"
                  onChange={Onchange}
                />
              </div>
            </form>
            <div className="btn-box">
              <button className="sub-btn" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default EditEvent;
