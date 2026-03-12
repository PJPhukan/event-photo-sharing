import React from "react";
import "./work.scss";

const Work = ({ item }) => {
  return (
    <div className="work-main" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      <div className="step-badge">
        <span>{item.number}</span>
      </div>
      <div className="image-shell">
        <img src={item.image} alt={item.title} />
      </div>

      <div className="work__info">
        <div className="step-label">Step {item.number}</div>
        <div className="card-heading">{item.title}</div>
        <div className="description">{item.description}</div>
      </div>
    </div>
  );
};

export default Work;
