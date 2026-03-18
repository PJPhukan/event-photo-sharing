import React, { useContext, useEffect, useState } from "react";
import "./itemdetails.scss";
import { context, dashboad } from "../../../Context/context";
import { downloadMedia } from "../../lib/downloadMedia";
import LoadingButton from "../LoadingButton/LoadingButton";
import CollectionPicker from "../CollectionPicker/CollectionPicker";

const ItemDetails = ({ imageId, setimageId, title }) => {
  const [loveStyle, setLoveStyle] = useState({
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0)",
  });
  const [image_data, setimage_data] = useState(null);
  const [collections, setCollections] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { get_image_details, add_favorite, get_collections } =
    dashboardContext;
  const { showToast } = userContext;

  const get_data = async () => {
    const result = await get_image_details(imageId);
    setimage_data(result.data.data?.image);
  };
  useEffect(() => {
    get_data();
  }, []);

  useEffect(() => {
    const loadCollections = async () => {
      const result = await get_collections();
      const data = result?.data?.data || [];
      setCollections(data);
    };
    loadCollections();
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

  const DownloadImage = async () => {
    try {
      await downloadMedia({
        url: image_data?.imageUrl,
        filename: image_data?.title || "download",
        resourceType: image_data?.resource_type,
      });
    } catch (error) {
      window.open(image_data?.imageUrl, "_blank", "noopener,noreferrer");
    }
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

  const SaveToFavorites = async () => {
    if (!image_data?._id) return;
    setLoadingAction("favorite");
    const result = await add_favorite({
      imageId: image_data._id,
      eventId: image_data.event_id,
    });
    if (result?.data?.success) {
      showToast(result.data.message || "Added to favorites", "success");
    }
    setLoadingAction("");
  };

  // Collection picker handles add.
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
          <div className="action-box">
            <LoadingButton
              className="btn secondary"
              loading={loadingAction === "favorite"}
              loadingText="Saving"
              onClick={SaveToFavorites}
            >
              <i className="bx bx-bookmark"></i>
              <span>Save</span>
            </LoadingButton>
            <button
              className="btn outline"
              onClick={() => setShowPicker(true)}
            >
              <i className="bx bx-collection"></i>
              <span>Add to collection</span>
            </button>
          </div>
        </div>
        <CollectionPicker
          open={showPicker}
          onClose={() => setShowPicker(false)}
          imageId={image_data?._id}
          anchor="left"
        />
      </div>
    )
  );
};

export default ItemDetails;
