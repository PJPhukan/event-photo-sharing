import React from "react";
import userImg from "../../assets/user.png";
import "./testimonialcard.scss";

const TestimonialCard = ({ card }) => {
  return (
    <>
      <div className="card-item">
        <div className="testimonial-card">
          <div className="rating">
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
          </div>
          <div className="text-content">{card.message}"</div>
          <img src={card.image ? card.image : userImg} alt="" />
          <div className="user-name">{card.userName}</div>
          <div className="details">
            <span>{card.country},</span>
            <span>{card.date}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialCard;
