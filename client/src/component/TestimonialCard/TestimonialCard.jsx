import React from "react";
import userImg from "../../assets/user.png";
import "./testimonialcard.scss";

const TestimonialCard = ({ card }) => {
  return (
    <div className="card-item" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      <div className="testimonial-card">
        <div className="rating">
          {Array.from({ length: card.rating || 5 }).map((_, index) => (
            <i className="bx bxs-star" key={index}></i>
          ))}
        </div>
        <div className="text-content">"{card.message}"</div>
        <div className="user-row">
          <img src={card.image ? card.image : userImg} alt={card.userName} />
          <div className="user-meta">
            <div className="user-name">{card.userName}</div>
            <div className="details">
              <span>{card.country}</span>
              <span>{card.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
