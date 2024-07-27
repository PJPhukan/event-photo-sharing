import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./clickselfie.scss";
const ClickSelfie = ({ settakeSelfie }) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const capture = () => {
    setImageSrc(null);
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
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
            <button onClick={capture}>Retake</button>
          </div>
          <button className="get-photos">Search Image</button>
        </div>
      </div>
    </div>
  );
};

export default ClickSelfie;
