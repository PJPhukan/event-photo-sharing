import "./faq.scss";
import React, { useState } from "react";
import FaqButton from "../../component/FaqButton/FaqButton";
import FaqQuestion from "../../component/FaqQuestion/FaqQuestion";
import data from "../../data/faq";

const Faq = () => {
  const [face, setFace] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [eventactive, setEventactive] = useState(false);

  const FaceRecognitionhandle = () => {
    setFace(true);
    setPrivacy(false);
    setEventactive(false);
  };
  const Privacyhandle = () => {
    setFace(false);
    setPrivacy(true);
    setEventactive(false);
  };
  const Eventhandle = () => {
    setFace(false);
    setPrivacy(false);
    setEventactive(true);
  };
  return (
    <>
      <section className="faq-section">
        <div className="main-content">
          <div className="heading">Frequently Asked Questions</div>
          <div className="sub-heading">
            We are here to help with any questions you have about security,
            recognition, photos and others
          </div>
          <div className="button-box">
            <div onClick={FaceRecognitionhandle}>
              <FaqButton text="Face Recognition" active={face} />
            </div>
            <div onClick={Privacyhandle}>
              <FaqButton text="Privacy" active={privacy} />
            </div>
            <div onClick={Eventhandle}>
              <FaqButton text="Create Event" active={eventactive} />
            </div>
          </div>

          <div className={`faq-question ${face ? "active" : "inactive"}`}>
            <FaqQuestion item={data[0].item} />
          </div>
          <div className={`faq-question ${privacy ? "active" : "inactive"}`}>
            <FaqQuestion item={data[1].item} />
          </div>
          <div
            className={`faq-question ${eventactive ? "active" : "inactive"}`}
          >
            <FaqQuestion item={data[2].item} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
