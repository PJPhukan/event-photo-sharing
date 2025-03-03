import "./usefor.scss";
import React from "react";
import UseForComponent from "../../component/UseFor/UseFor";
import useforData from "../../data/usefor-data";
const UseFor = () => {
  return (
    <section className="use-for">
      <div className="main-content">
        <div className="heading" data-aos="fade-up"
     data-aos-anchor-placement="top-bottom">Works for all types of Events</div>
        <div className="card-section" data-aos="fade-up"
     data-aos-anchor-placement="top-bottom">
          {useforData.map((item) => {
            return <UseForComponent key={item.id} item={item} />;
          })}
        </div>
        <div className="use-for-footer" data-aos="fade-up"
     data-aos-anchor-placement="top-bottom">
          and many other use cases like birthday, camps, cruise ships and etc...
        </div>
      </div>
    </section>
  );
};

export default UseFor;
