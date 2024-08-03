import React, { useContext, useEffect, useState } from "react";
import "./itemdetails.scss";
import image from "../../assets/car.jpg";
import video from "../../assets/video.mp4";
import { dashboad } from "../../../Context/context";

const ItemDetails = ({ imageId, setimageId, title }) => {
  const [loveStyle, setLoveStyle] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
  });
  const [image_data, setimage_data] = useState(null);
  const dashboardContext = useContext(dashboad);
  const { get_image_details } = dashboardContext;

  const get_data = async () => {
    const result = await get_image_details(imageId);
    setimage_data(result.data.data?.image);
  };
  useEffect(() => {
    get_data();
  }, []);

  const handleDoubleClick = async () => {
    setLoveStyle({
      opacity: 1,
      transform: "translate(-50%, -50%) scale(8)",
    });

    setTimeout(() => {
      setLoveStyle({
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0)",
      });
    }, 1200);
  };

  const handleClose = () => {
    setimageId(null);
  };

  const DownloadImage = (e) => {
    console.log("Download image was clicked");
    const link = document.createElement("a");
    link.href = image_data?.imageUrl;
    link.download = image_data.title || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ShareImage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image_data?.title,
          url: image_data?.imageUrl,
        });
      } catch (error) {
        console.log("Something went wrong while sharing");
      }
    } else {
      navigator.clipboard
        .writeText(image_data?.imageUrl)
        .then(() => {
          alert("Link copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    }
  };
  return (
    imageId && (
      <div className="item-details">
        <div className="main-box">
          <button className="cross-icon" onClick={handleClose}>
            <i className="bx bx-x"></i>
          </button>
          <h5 className="event-name">{title}</h5>
          {image_data && (
            <div className="media-box" onDoubleClick={handleDoubleClick}>
              {image_data?.resource_type === "image" && (
                <img src={image_data?.imageUrl} alt="" className="item-image" />
              )}
              {image_data?.resource_type !== "image" && (
                <video className="item-image" controls>
                  <source src={image_data?.imageUrl} type="video/mp4" />
                </video>
              )}
              <i className="bx bxs-heart" id="love" style={loveStyle}></i>
            </div>
          )}
          <div className="button-box">
            <button className="btn" onClick={DownloadImage}>
              <i className="bx bxs-download"></i>
              <span>Download</span>
            </button>
            <button className="btn" onClick={ShareImage}>
              <i className="bx bxs-share-alt"></i>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ItemDetails;
