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
  const [messages, setmessages] = useState(null);

  const get_all = async () => {
    const result = await get_all_notification();
    setnotifications(result);
    setmessages(result);
  };
  useEffect(() => {
    get_all();
  }, []);

  useEffect(() => {}, [messages, setmessages]);

  const NotificationAll = async () => {
    setmessages(notifications);
    setshowAll(true);
    setshowUnread(false);
    setshowRead(false);
    return;
  };

  const NotificationUnread = async () => {
    const filteredNotification = notifications?.filter((item) => {
      return !item.read;
    });
    setmessages(filteredNotification);
    setshowAll(false);
    setshowUnread(true);
    setshowRead(false);
  };

  const NotificationRead = async () => {
    const filteredNotification = notifications?.filter((item) => {
      return item.read;
    });
    setmessages(filteredNotification);
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
            {messages?.length > 0 ? (
              messages?.map((item) => {
                return (
                  <Message
                    key={item._id}
                    message={item}
                    notifications={notifications}
                  />
                );
              })
            ) : (
              <div className="no-notification">
                Don't have any notifications
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
