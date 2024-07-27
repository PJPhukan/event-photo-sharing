import React, { useEffect, useState } from "react";
import "./selfie.scss";
import ProfileImg from "../../assets/collLogo.png";
import Item from "../../component/Item/Item";
import ClickSelfie from "../../component/ClickSelfie/ClickSelfie";
const Selfie = () => {
  const [takeSelfie, settakeSelfie] = useState(false);
  useEffect(() => {}, [takeSelfie]);

  return (
    <div className="selfie">
      {takeSelfie && <ClickSelfie settakeSelfie={settakeSelfie} />}
      <div className="top-details-main">
        <img src={ProfileImg} alt="" className="event-avatar" />
        <div className="details-left">
          <div className="top-text-details">
            <div className="left-text-details">
              <h5 className="main-heading">
                College Annual Function
                <span className="sub-heading">Marrage</span>
              </h5>
              <div className="event-description">
                Discover a curated collection of stunning images perfect for
                enhancing your creative endeavors. High-quality, versatile, and
                ready to inspire.
              </div>
            </div>
            <button className="take-selfie" onClick={() => {settakeSelfie(true)
              console.log('hello ')
            }}>
              <i className="bx bxs-camera"></i>
              <span className="upload-text">Take Selfie</span>
            </button>
          </div>
          <div className="mobile-desc">
            Discover a curated collection of stunning images perfect for
            enhancing your creative endeavors. High-quality, versatile, and
            ready to inspire.
          </div>
          <div className="address-container">
            <div className="address-box">
              <i className="bx bx-calendar"></i>
              <span>12 pm , 25 June ,2024</span>
            </div>
            <div className="address-box">
              <i className="bx bx-phone"></i>
              <span>
                <span className="country-code">+91</span>
                <span>7002925194</span>
              </span>
            </div>
            <div className="address-box">
              <i className="bx bx-map"></i>
              <span>Maligoan, Guwahati, Assam , India</span>
            </div>
          </div>
        </div>
      </div>
      <div className="event-items">
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </div>
  );
};

export default Selfie;
