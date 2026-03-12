
import React, { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./clickselfie.scss";
import { dashboad } from "../../../Context/context";
import LoadingButton from "../LoadingButton/LoadingButton";
const ClickSelfie = ({
  settakeSelfie,
  fetchData,
  setuserImage,
  setloading,
  setIsSearchingResults,
}) => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const dashboardState = useContext(dashboad);
  const { recognize } = dashboardState;

  const capture = () => {
    setImageSrc(null);
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };
  useEffect(() => {}, [imageSrc]);
  const SearchImg = async () => {
    console.log('🚀 SearchImg called! Images:', fetchData?.length || 0, imageSrc ? '✅' : '❌');
    
    setloading(true);
    setIsSearching(true);
    
    const userImagePromises = fetchData.map(async (item, index) => {
      if (item.resource_type === "image") {
        console.log(`🔍 Checking image ${index}:`, item.imageUrl);
        const result = await recognize(imageSrc, item.imageUrl);
        console.log(`✅ Image ${index} result:`, result);
        return result ? item : null;
      }
      return null;
    });
    
    const userImageResults = await Promise.all(userImagePromises);
    const userImages = userImageResults.filter((item) => item !== null);
    console.log('🎯 Final matches:', userImages.length);
    
    setuserImage(userImages);
    setloading(false);
    setIsSearching(false);
    setIsSearchingResults(true);
    settakeSelfie(false);
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
          <LoadingButton
            className={`get-photos ${imageSrc ? "" : "disabled"}`}
            disabled={!imageSrc}
            loading={isSearching}
            loadingText="Searching"
            onClick={SearchImg}
          >
            Search Image
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ClickSelfie;
