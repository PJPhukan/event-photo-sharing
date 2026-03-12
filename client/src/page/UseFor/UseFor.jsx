import "./usefor.scss";
import React from "react";
import { Link } from "react-router-dom";
import UseForComponent from "../../component/UseFor/UseFor";
import useforData from "../../data/usefor-data";

const UseFor = ({ compact = false }) => {
  return (
    <section className={`use-for ${compact ? "is-compact" : "is-standalone"}`}>
      <div className="main-content">
        {!compact && (
          <div className="use-for-hero">
            <div className="hero-copy" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
              <div className="heading">
                Memois works across <span>weddings, campuses, races, teams, and private communities.</span>
              </div>
              <div className="sub-heading">
                The product is built for events where people want their own memories quickly,
                while hosts want one polished gallery instead of scattered links and manual delivery.
              </div>
              <div className="use-for-tags">
                <span>Guest discovery</span>
                <span>Face recognition</span>
                <span>Private sharing</span>
              </div>
            </div>

            <div className="hero-side" data-aos="fade-left">
              <div className="use-for-visual">
                <div className="visual-orbit orbit-one"></div>
                <div className="visual-orbit orbit-two"></div>
                <div className="visual-card main-card">
                  <div className="card-top">
                    <span className="dot"></span>
                    Event Coverage
                  </div>
                  <div className="card-title">
                    The same polished sharing flow can work for weddings, campuses, races, teams, and clubs.
                  </div>
                  <div className="card-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="visual-card floating-card top-card">
                  <span>Weddings</span>
                </div>
                <div className="visual-card floating-card bottom-card">
                  <span>Schools and colleges</span>
                </div>
                <div className="visual-card floating-card side-card">
                  <span>Corporate events</span>
                </div>
                <div className="visual-pulse"></div>
              </div>
            </div>

            <div className="use-for-actions hero-actions">
              <Link to="/login" state={{ redirectToCreateEvent: true }}>
                Create Event
              </Link>
              <Link to="/about" className="secondary-action">
                Know More
              </Link>
            </div>
          </div>
        )}

        <div className="section-head" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <h2>{compact ? "Works for all types of events" : "Where it fits best"}</h2>
          <p>Choose the kind of event experience you want to shape.</p>
        </div>

        <div className="card-section" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          {useforData.map((item) => {
            return <UseForComponent key={item.id} item={item} />;
          })}
        </div>

        {!compact && (
          <div className="use-for-footer" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
            Memois also adapts well to birthdays, camps, cruise experiences, reunions, and other memory-heavy events.
          </div>
        )}
      </div>
    </section>
  );
};

export default UseFor;
