import React from "react";
import "./UseFor.scss"
import { Link } from "react-router-dom";
const UseFor = ({ item }) => {
  return (
    <>
      <div className="card" data-aos="fade-up"
     data-aos-anchor-placement="top-bottom">
        <img src={item.image} alt="" />
        <div className="card-text">
          <div className="card-heading">{item.title}</div>
          <div className="card-description">{item.description}</div>
          <Link to={item.slug}>Read More<i className='bx bx-right-arrow-alt'></i></Link>
        </div>
      </div>
    </>
  );
};

export default UseFor;
