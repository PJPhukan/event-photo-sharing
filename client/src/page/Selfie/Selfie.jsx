import React, { useContext, useEffect, useState } from "react";
import "./selfie.scss";
import ProfileImg from "../../assets/collLogo.png";
import Item from "../../component/Item/Item";
import ClickSelfie from "../../component/ClickSelfie/ClickSelfie";
import { useParams } from "react-router-dom";
import { dashboad } from "../../../Context/context";
import SelfieItem from "../../component/SelfieItem/SelfieItem";
import Loader from "../../component/Loader/Loader";
const Selfie = () => {
  const [takeSelfie, settakeSelfie] = useState(false);
  useEffect(() => {}, [takeSelfie]);
  const { get_details } = useContext(dashboad);
  const { userId, eventId } = useParams();
  const [event_data, setevent_data] = useState(null);
  const [fetchData, setfetchData] = useState(null);
  const [loading, setloading] = useState(false);
  const [userImage, setuserImage] = useState(null);

  const getEventDetails = async () => {
    const result = await get_details(userId, eventId);
    setevent_data(result);
    setfetchData(event_data?.image_details);
  };
  useEffect(() => {
    const fn = async () => {
      await getEventDetails();
    };
    fn();
  });
  useEffect(() => {}, [loading]);
  useEffect(() => {
    // console.log(fetchData);
  }, [userImage]);

  // console.log(event_data);

  const returnTimeDate = (time) => {
    const date = new Date(time);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);
    const [datePart, timePart] = formattedDate.split(", ");
    const [hour, minute] = timePart.split(":");
    const customFormattedDate = `${hour}:${minute},${datePart}`;
    return customFormattedDate;
  };
  return (
    event_data && (
      <div className="selfie">
        {takeSelfie && (
          <ClickSelfie
            settakeSelfie={settakeSelfie}
            fetchData={fetchData}
            setuserImage={setuserImage}
            setloading={setloading}
          />
        )}
        <div className="top-details-main">
          <img src={event_data.CoverImage} alt="" className="event-avatar" />
          <div className="details-left">
            <div className="top-text-details">
              <div className="left-text-details">
                <h5 className="main-heading">
                  {event_data.EventName}
                  <span className="sub-heading">{event_data.EventType}</span>
                </h5>
                <div className="event-description">
                  {event_data.EventDescription}
                </div>
              </div>
              <button
                className="take-selfie"
                onClick={() => {
                  settakeSelfie(true);
                }}
              >
                <i className="bx bxs-camera"></i>
                <span className="upload-text">Take Selfie</span>
              </button>
            </div>
            <div className="mobile-desc">{event_data.EventDescription}</div>
            <div className="address-container">
              <div className="address-box">
                <i className="bx bx-calendar"></i>
                <span>{returnTimeDate(event_data.EventDate)}</span>
              </div>
              <div className="address-box">
                <i className="bx bx-phone"></i>
                <span>
                  <span className="country-code">+91</span>
                  <span>{event_data.ContactDetails}</span>
                </span>
              </div>
              <div className="address-box">
                <i className="bx bx-map"></i>
                <span>{event_data.EventLocation}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="event-items">
          {loading ? (
            <Loader />
          ) : userImage && userImage.length > 0 ? (
            userImage?.map((item) => <SelfieItem item={item} key={item._id} />)
          ) : (
            fetchData?.map((item) => <SelfieItem item={item} key={item._id} />)
          )}
        </div>
      </div>
    )
  );
};

export default Selfie;
