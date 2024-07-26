import React, { useContext, useState } from "react";
import "./eventdetails.scss";
import { useParams } from "react-router-dom";
import ProfileImg from "../../assets/collLogo.png";
import Item from "../../component/Item/Item";
import context from "../../../Context/context";

const EventDetails = () => {
  const { id } = useParams();
  const { seteditEvent,setdownloadQR } = useContext(context);
  const [showPopUP, setshowPopUP] = useState(false);
  return (
    <div className="event-details-main">
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
            <div className="right-text-details">
              <div className="right-item-button">
                <label htmlFor="upload">
                  <i className="bx bx-cloud-upload"></i>
                  <span className="upload-text">Upload</span>
                </label>
                <input type="file" id="upload" />
              </div>
              <div className="right-item-pop-up-button">
                <i
                  className="bx bx-dots-vertical-rounded"
                  onClick={() => {
                    setshowPopUP(!showPopUP);
                  }}
                ></i>
                <div
                  className={`pop-up-menu ${showPopUP ? "active-pop-up" : ""}`}
                >
                  <button
                    className="cross-icon"
                    onClick={() => {
                      setshowPopUP(false);
                    }}
                  >
                    <i className="bx bx-x"></i>
                  </button>

                  <button
                    className="more-item"
                    onClick={() => seteditEvent(true)}
                  >
                    <i className="bx bx-edit-alt"></i>
                    <span>Edit</span>
                  </button>
                  <button className="more-item">
                    <i className="bx bx-share-alt"></i>
                    <span>Share</span>
                  </button>
                  <button className="more-item" onClick={()=>setdownloadQR(true)}>
                    <i className="bx bx-qr"></i>
                    <span>QR Code</span>
                  </button>
                  <button className="more-item">
                    <i className="bx bx-trash"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
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

export default EventDetails;
