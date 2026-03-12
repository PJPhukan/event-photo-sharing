import "./howwork.scss";
import React from "react";
import data from "../../data/how-work";
import Work from "../../component/Work/Work";

const HowWork = () => {
  return (
    <section className="how-works">
      <div className="main-content">
        <div className="section-copy" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <div className="heading">How it works</div>
          <div className="sub-heading">
            A simple three-step flow for hosts and guests, designed to feel smooth from event setup to photo discovery.
          </div>
        </div>

        <div className="card-section">
          {data.map((item, index) => (
            <React.Fragment key={item.id}>
              <Work item={item} />
              {index < data.length - 1 && (
                <div className="flow-arrow" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWork;
