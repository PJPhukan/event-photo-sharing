import React from "react";
import "./work.scss";
const Work = ({ item }) => {
  return (
    <div className="work">
      <img src={item.image} alt="" />

      <div className="work__info">
        <div className="card-heading">{item.title}</div>
        <div className="description">{item.description}</div>
      </div>
      <div className="number">
        <span>{item.number}</span>
      </div>
    </div>
  );
};

export default Work;
