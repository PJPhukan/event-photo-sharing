import React, { useState } from "react";
import "./item.scss";
import ItemImage from "../../assets/card-bg2.jpg";
import ItemVideo from "../../assets/video.mp4";
const Item = () => {
  const type = "video";
  const [isLiked, setisLiked] = useState(false);
  const [showDropdown, setshowDropdown] = useState(false);
  const [loveStyle, setLoveStyle] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
  });
  //TODO: Update likes

  //TODO:Delete logic
  const DeleteImage = (id) => {
    console.log("Delete image was clicked");
  };

  //TODO:Share logic
  const ShareImage = () => {
    console.log(object);
  };

  //TODO:Download logic
  const DownloadImage = () => {
    console.log("Download image was clicked");
  };

  //Double clicked love effect
  const handleDoubleClick = () => {
    setLoveStyle({
      opacity: 1,
      transform: "translate(-50%, -50%) scale(3)",
    });
    setisLiked(true);
    setTimeout(() => {
      setLoveStyle({
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0)",
      });
    }, 800);
  };
  return (
    <div className="item" onDoubleClick={handleDoubleClick}>
      {type === "image" && <img src={ItemImage} alt="" className="item-image" />}
      {type !== "image" && (
        <video width="100%" height="100%" loop >
          <source src={ItemVideo} type="video/mp4" />
        </video>
      )}
      <i className="bx bxs-heart" id="love" style={loveStyle}></i>
      <div className="like-deteails-icon" onClick={() => setisLiked(!isLiked)}>
        {!isLiked && <i className="bx bx-heart"></i>}
        {isLiked && <i className="bx bxs-heart active"></i>}
        12 Likes
      </div>
      <div
        className="img-more "
        onClick={() => {
          setshowDropdown(!showDropdown);
        }}
      >
        <i className="bx bx-dots-vertical-rounded"></i>
      </div>
      <div
        className={`dropdown-menu-more ${
          showDropdown ? "show-dropdown-menu" : ""
        }`}
      >
        <button
          className="cross-icon"
          onClick={() => {
            setshowDropdown(false);
          }}
        >
          <i className="bx bx-x"></i>
        </button>

        <button className="more-item" onClick={ShareImage}>
          <i className="bx bx-share-alt"></i>
          Share
        </button>
        <button className="more-item" onClick={DownloadImage}>
          <i className="bx bx-download"></i>
          Download
        </button>
        <button className="more-item" onClick={DeleteImage}>
          <i className="bx bx-trash"></i>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Item;
