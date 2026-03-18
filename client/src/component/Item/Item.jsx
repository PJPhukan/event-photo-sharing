import React, { useContext, useEffect, useRef, useState } from "react";
import "./item.scss";
import { context, dashboad } from "../../../Context/context";
import ItemDetails from "../ItemDetails/ItemDetails";
import LoadingButton from "../LoadingButton/LoadingButton";
import { downloadMedia } from "../../lib/downloadMedia";
import CollectionPicker from "../CollectionPicker/CollectionPicker";

const Item = ({ item, setimageId, onDeleteComplete, showInlineActions = false }) => {
  //ALL CONTEXT
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { new_likes, dislike, delete_image, add_favorite, get_collections } =
    dashboardContext;
  const { userId, showToast } = userContext;

  //ALL USE-STATE
  const [isLiked, setisLiked] = useState(false);
  const [showDropdown, setshowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [localLikes, setLocalLikes] = useState(item?.likes || []);
  const dropdownRef = useRef(null);
  const [loveStyle, setLoveStyle] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
  });

  //ALL USE-EFFECT
  useEffect(() => {
    item;
  });

  useEffect(() => {
    isLikesUser();
  }, [item?.likes, userId]);

  const isLikesUser = () => {
    const currentUserId =
      userId || window.localStorage.getItem("userId") || "";
    if (!currentUserId) {
      setisLiked(false);
      return;
    }
    const found = localLikes?.some((like) => {
      const likedUserId = like?.likedUser?._id || like?.likedUser;
      return `${likedUserId}` === `${currentUserId}`;
    });
    setisLiked(Boolean(found));
  };

  useEffect(() => {
    setLocalLikes(item?.likes || []);
  }, [item?.likes]);

  // console.log(item);
  //TODO:Delete logic
  const DeleteImage = async () => {
    setIsDeleting(true);
    const result = await delete_image(item?._id);
    setIsDeleting(false);
    if (result?.data?.success) {
      setshowDropdown(false);
      onDeleteComplete?.();
    }
  };

  const SaveToFavorites = async () => {
    setIsSaving(true);
    const payload = {
      imageId: item?._id,
      eventId: item?.event_id,
    };
    const result = await add_favorite(payload);
    if (result?.data?.success) {
      showToast(result.data.message || "Added to favorites", "success");
    }
    setIsSaving(false);
  };

  const loadCollections = async () => {
    if (collections.length > 0) return;
    const result = await get_collections();
    const data = result?.data?.data || [];
    setCollections(data);
  };

  // Collection picker handles add.

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
  const DownloadImage = async () => {
    try {
      await downloadMedia({
        url: item.imageUrl,
        filename: item.title || "download",
        resourceType: item.resource_type,
      });
    } catch (error) {
      window.open(item.imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  const show_image = () => {
    if (setimageId) {
      setimageId(item?._id);
    }
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
    const res = await new_likes(payload);
    if (res?.data?.success) {
      const currentUserId =
        userId || window.localStorage.getItem("userId") || "";
      if (currentUserId) {
        setLocalLikes((prev) => [...prev, { likedUser: currentUserId }]);
      }
      setisLiked(true);
    }
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
      const res = await new_likes(payload);
      if (res?.data?.success) {
        const currentUserId =
          userId || window.localStorage.getItem("userId") || "";
        if (currentUserId) {
          setLocalLikes((prev) => [...prev, { likedUser: currentUserId }]);
        }
        setisLiked(true);
      }
    } else {
      const imageId = item?._id;
      const res = await dislike(imageId);
      if (res?.data?.success) {
        const currentUserId =
          userId || window.localStorage.getItem("userId") || "";
        setLocalLikes((prev) =>
          prev.filter((like) => {
            const likedUserId = like?.likedUser?._id || like?.likedUser;
            return `${likedUserId}` !== `${currentUserId}`;
          })
        );
        setisLiked(false);
      }
    }
  };

  const len = localLikes?.length;

  useEffect(() => {
    if (!showDropdown) {
      return undefined;
    }

    loadCollections();

    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setshowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (showInlineActions) {
      loadCollections();
    }
  }, [showInlineActions]);

  return (
    <div
      className="item"
      onDoubleClick={handleDoubleClick}
      onClick={show_image}
    >
      <div className="media-wrapper">
        {item?.resource_type === "image" && (
          <img src={item.imageUrl} alt="" className="item-image" />
        )}
        {item?.resource_type !== "image" && (
          <video className="item-image" loop>
            <source src={item?.imageUrl} type="video/mp4" />
          </video>
        )}
      </div>
      <i className="bx bxs-heart" id="love" style={loveStyle}></i>
      <div
        className="like-deteails-icon"
        onClick={(event) => {
          event.stopPropagation();
          handleLike();
        }}
      >
        {!isLiked && <i className="bx bx-heart"></i>}
        {isLiked && <i className="bx bxs-heart active"></i>}
        {len} Likes
      </div>
      {showInlineActions && (
        <div className="inline-actions" onClick={(event) => event.stopPropagation()}>
          <button
            className="inline-btn"
            onClick={SaveToFavorites}
            disabled={isSaving}
            title="Save to favorites"
          >
            <i className="bx bx-bookmark"></i>
          </button>
        </div>
      )}
      <div
        className="img-more "
        onClick={(event) => {
          event.stopPropagation();
          setshowDropdown(!showDropdown);
        }}
      >
        <i className="bx bx-dots-vertical-rounded"></i>
      </div>
      <div
        ref={dropdownRef}
        className={`dropdown-menu-more ${
          showDropdown ? "show-dropdown-menu" : ""
        }`}
        onClick={(event) => event.stopPropagation()}
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
        <LoadingButton
          className="more-item"
          onClick={SaveToFavorites}
          loading={isSaving}
          loadingText="Saving"
        >
          <i className="bx bx-bookmark"></i>
          Save
        </LoadingButton>
        <button className="more-item" onClick={() => setShowPicker(true)}>
          <i className="bx bx-collection"></i>
          Add to collection
        </button>
        <LoadingButton
          className="more-item"
          onClick={DeleteImage}
          loading={isDeleting}
          loadingText="Deleting"
        >
          <i className="bx bx-trash"></i>
          Delete
        </LoadingButton>
      </div>
      <CollectionPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        imageId={item?._id}
        anchor="right"
      />
    </div>
  );
};

export default Item;
