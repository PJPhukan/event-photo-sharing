import React, { useContext, useEffect } from "react";
import "./message.scss";
import { dashboad } from "../../../Context/context";

const Message = ({ message, notifications }) => {
  const dashboardContext = useContext(dashboad);
  const { mark_as_read, delete_notification } = dashboardContext;
  const MarkAsRead = async () => {
    await mark_as_read(message._id);
  };

  const DeleteNotification = async () => {
    await delete_notification(message._id);
  };
  useEffect(() => {});

  return (
    message && (
      <div className="message">
        <div className="left">
          <div className="like-user-avatar">
            {message.type === "like" ? (
              <i className="bx bxs-like" style={{ background: "#003fff" }}></i>
            ) : (
              <i className="bx bxs-message" style={{ background: "#7ed87e" }}></i>
            )}
            <img src={message.avatar} alt="" />
          </div>
          <p className="message-text">{message.message}</p>
        </div>
        {message.read ? (
          <i className="bx bx-trash" onClick={DeleteNotification}></i>
        ) : (
          <i className="bx bx-check-double" onClick={MarkAsRead}></i>
        )}
      </div>
    )
  );
};

export default Message;
