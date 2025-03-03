import React, { useContext, useEffect, useState } from "react";
import "./notification.scss";
import Message from "../Message/Message";
import { context, dashboad } from "../../../Context/context";

const Notification = () => {
  const UserContext = useContext(context);
  const { showNotification, setshowNotification } = UserContext;
  const dashboardContext = useContext(dashboad);
  const { get_all_notification } = dashboardContext;
  const HideNotification = () => {
    setshowNotification(false);
  };
  const [showAll, setshowAll] = useState(true);
  const [showUnread, setshowUnread] = useState(false);
  const [showRead, setshowRead] = useState(false);
  const [notifications, setnotifications] = useState(null);
  const [allMessage, setallMessage] = useState(null);
  const [readMessage, setreadMessage] = useState(null);
  const [unreadMessage, setunreadMessage] = useState(null);

  const get_all = async () => {
    const result = await get_all_notification();
    setnotifications(result);
    setallMessage(result);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      get_all();
    }
  });

  const NotificationAll = async () => {
    setallMessage(notifications);
    setshowAll(true);
    setshowUnread(false);
    setshowRead(false);
    return;
  };

  const NotificationUnread = async () => {
    const filteredNotification = notifications?.filter((item) => {
      return !item.read;
    });
    setunreadMessage(filteredNotification);
    setshowAll(false);
    setshowUnread(true);
    setshowRead(false);
  };

  const NotificationRead = async () => {
    const filteredNotification = notifications?.filter((item) => {
      return item.read;
    });
    setreadMessage(filteredNotification);
    setshowAll(false);
    setshowUnread(false);
    setshowRead(true);
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
          <div className="button-box">
            <button
              className={`btn ${showAll ? "active" : ""}`}
              onClick={NotificationAll}
            >
              All
            </button>
            <button
              className={`btn ${showUnread ? "active" : ""}`}
              onClick={NotificationUnread}
            >
              Unread
            </button>
            <button
              className={`btn ${showRead ? "active" : ""}`}
              onClick={NotificationRead}
            >
              Read
            </button>
          </div>
          <div className="message-box">
            {showAll &&
              allMessage?.length > 0 &&
              allMessage.map((item) => (
                <Message key={item._id} message={item} />
              ))}
            {showUnread &&
              unreadMessage?.length > 0 &&
              unreadMessage.map((item) => (
                <Message key={item._id} message={item} />
              ))}
            {showRead &&
              readMessage?.length > 0 &&
              readMessage.map((item) => (
                <Message key={item._id} message={item} />
              ))}
            {(!allMessage?.length && showAll) ||
            (!unreadMessage?.length && showUnread) ||
            (!readMessage?.length && showRead) ? (
              <div className="no-notification">
                Don't have any notifications
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
