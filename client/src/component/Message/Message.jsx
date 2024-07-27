import React, { useContext } from "react";
import "./message.scss";
import profileImg from "../../assets/profile.jpg";
import {context} from "../../../Context/context";
const Message = () => {
  const Contexts = useContext(context);
  const { RemoveNotification } = Contexts;
  return (
    <div className="message">
      <div className="left">
        <div className="like-user-avatar">
          <i className="bx bxs-like"></i>
          <img src={profileImg} alt="" />
        </div>
        <p className="message-text">Paragjyoti Likes your photo.</p>
      </div>
      <i className="bx bx-check-double" onClick={RemoveNotification}></i>
    </div>
  );
};

export default Message;
