import React from "react";
import "./showoffcard.scss";
import CountUp from "react-countup";
const ShowOffCard = ({ item }) => {
  return (
    <div className="box">
      <div className="show-off-card">
        {/* <img src={item.image} alt="" /> */}
        <div className="amount">
          <CountUp start={0} end={item.amount} duration={2.75} />
          {item.sufix}
        </div>
        <div className="content">{item.content}</div>
      </div>
    </div>
  );
};

export default ShowOffCard;
