import "./home.scss";
import React from "react";
import { Link } from "react-router-dom";
import HomeImg from "../../assets/home-image.png";
import UseFor from "../UseFor/UseFor";
import HowWork from "../HowWork/HowWork";
import Faq from "../Faq/Faq";
import Testimonial from "../Testimonial/Testimonial";
const Home = () => {
  return (
    <>
      <section className="home-section">
        <div className="home">
          <div className="home-text-content">
            <div
              className="heading"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
            >
              <span>C</span>apture and <span>S</span>hare Your <span>P</span>
              recious <span>M</span>oments with <span>M</span>oment{" "}
              <span>M</span>
              emoirs
            </div>
            <div
              className="sub-heading-text"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
            >
              Visitors can take a selfie, and their pictures will be instantly
              accessible.
            </div>
            <div
              className="facility-button"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
            >
              <button>Privacy first </button>
              <button>Face Recognition</button>
              <button>Completely Free</button>
            </div>

            <div
              className="home-create-event"
            >
              <Link to="/create-event" 
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom">Create Event</Link>
            </div>
          </div>
          <div className="image-content">
            <img src={HomeImg} alt="" />
          </div>
        </div>
      </section>
      <UseFor />
      <HowWork />
      <Faq />
      <Testimonial />
    </>
  );
};

export default Home;
