import "./howwork.scss";
import React from "react";
import data from "../../data/how-work";
import Work from "../../component/Work/Work";
const HowWork = () => {
  return (
    <>
      <section className="how-works">
        <div className="main-content">
          <div className="heading">How it works</div>
          <div className="card-section">
            {data.map((item) => {
              return <Work key={item.id} item={item} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowWork;
