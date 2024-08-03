import React, { useContext, useEffect, useState } from "react";
import "./item.scss";
import { context, dashboad } from "../../../Context/context";
import ItemDetails from "../ItemDetails/ItemDetails";
const Item = ({ item, setimageId }) => {
  //ALL USE-EFFECT
  useEffect(() => {
    item;
  });

  useEffect(() => {
    isLikesUser();
  }, []);

  useEffect(() => {}, [item?.likes]);

  //ALL USE-STATE
  const [isLiked, setisLiked] = useState(false);
  const [showDropdown, setshowDropdown] = useState(false);
  const [loveStyle, setLoveStyle] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
  });

  //ALL CONTEXT
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { new_likes, dislike } = dashboardContext;
  const { userId } = userContext;

  const isLikesUser = () => {
    const findUserById = (array) => {
      return array?.find((obj) => obj.likedUser === userId);
    };
    let islike = findUserById(item?.likes);
    if (islike) {
      setisLiked(true);
    } else {
      setisLiked(false);
    }
  };

  // console.log(item);
  //TODO:Delete logic
  const DeleteImage = (id) => {
    console.log("Delete image was clicked");
  };

  //TODO:Share logic
  const ShareImage = async () => {
    // console.log(object);
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          url: item.imageUrl,
        });
      } catch (error) {
        console.log("Something went wrong while sharing");
      }
    } else {
      navigator.clipboard
        .writeText(item.imageUrl)
        .then(() => {
          alert("Link copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    }
  };

  //TODO:Download logic
  const DownloadImage = (e) => {
    console.log("Download image was clicked");
    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = item.title || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const show_image = () => {
    setimageId(item?._id);
  };
  const handleDoubleClick = async () => {
    setLoveStyle({
      opacity: 1,
      transform: "translate(-50%, -50%) scale(3)",
    });
    const payload = {
      owner: item?.user_id,
      imageId: item?._id,
      eventId: item?.event_id,
    };
    await new_likes(payload);
    setisLiked(true);
    setTimeout(() => {
      setLoveStyle({
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0)",
      });
    }, 800);
  };

  const handleLike = async () => {
    if (!isLiked) {
      const payload = {
        owner: item?.user_id,
        imageId: item?._id,
        eventId: item?.event_id,
      };
      await new_likes(payload);
      // console.log(result);
      setisLiked(true);
    } else {
      const imageId = item?._id;
      await dislike(imageId);
      // console.log(result);
      setisLiked(false);
    }
  };

  const len = item?.likes?.length;
  return (
    <div
      className="item"
      onDoubleClick={handleDoubleClick}
      onClick={show_image}
    >
      {item?.resource_type === "image" && (
        <img src={item.imageUrl} alt="" className="item-image" />
      )}
      {item?.resource_type !== "image" && (
        <video className="item-image" loop>
          <source src={item?.imageUrl} type="video/mp4" />
        </video>
      )}
      <i className="bx bxs-heart" id="love" style={loveStyle}></i>
      <div className="like-deteails-icon" onClick={handleLike}>
        {!isLiked && <i className="bx bx-heart"></i>}
        {isLiked && <i className="bx bxs-heart active"></i>}
        {len} Likes
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
