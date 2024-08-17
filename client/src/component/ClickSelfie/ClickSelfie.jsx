import React, { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./clickselfie.scss";
import { dashboad } from "../../../Context/context";
const ClickSelfie = ({
  settakeSelfie,
  fetchData,
  setuserImage,
  setloading,
}) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const dashboardState = useContext(dashboad);
  const { recognize } = dashboardState;

  const capture = () => {
    setImageSrc(null);
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };
  useEffect(() => {}, [imageSrc]);

  const SearchImg = async () => {
    settakeSelfie(false);
    setloading(true);
    const userImagePromises = fetchData.map(async (item) => {
      if (item.resource_type === "image") {
        const result = await recognize(imageSrc, item.imageUrl);
        return result ? item : null;
      }
      return null;
    });
    const userImageResults = await Promise.all(userImagePromises);
    const userImages = userImageResults.filter((item) => item !== null);
    setuserImage(userImages);
    setloading(false);
  };

  return (
    <div className="click-selfie-main">
      <div className="main-content">
        <button className="close-button" onClick={() => settakeSelfie(false)}>
          <i className="bx bx-x"></i>
        </button>

        <div className="cemera-box">
          {imageSrc ? (
            <img src={imageSrc} />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="camera-round"
            />
          )}
        </div>
        <div className="button-box">
          <div className="top-button-box">
            <button onClick={capture}>Take</button>
            <button onClick={() => setImageSrc(null)}>Retake</button>
          </div>
          <button
            className={`get-photos ${imageSrc ? "" : "disabled"}`}
            disabled={!imageSrc}
            onClick={SearchImg}
          >
            Search Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClickSelfie;
