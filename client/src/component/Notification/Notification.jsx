import React, { useContext } from "react";
import "./notification.scss";
import Message from "../Message/Message";
import context from "../../../Context/context";

const Notification = () => {
  const UserContext = useContext(context);
  const { showNotification, setshowNotification } = UserContext;

  const HideNotification = () => {
    setshowNotification(false);
  };
  return (
    <>
      {showNotification && (
        <div
          className={`${
            showNotification ? "notification-active" : ""
          } notification`}
        >
          <div className="top-heading">
            <h2 className="notification-heading">Notifications</h2>
            <button onClick={HideNotification}>
              <i className="bx bx-x"></i>
              <span>Close</span>
            </button>
          </div>

          <div className="message-box">
            <Message />
            <Message />
            <Message />
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
