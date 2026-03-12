import { useContext, useState, useEffect, useRef } from "react";
import "./eventdetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import ProfileImg from "../../assets/collLogo.png";
import Item from "../../component/Item/Item";
import { context, dashboad } from "../../../Context/context";
import ItemDetails from "../../component/ItemDetails/ItemDetails";
import { APP_URL } from "../../lib/config";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const EventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { seteditEvent, setdownloadQR } = useContext(context);
  const [imageId, setimageId] = useState(null);
  // const [details, setdetails] = useState(null);
  const {
    get_event_details,
    event_data,
    setqrtext,
    delete_event,
    upload_image,
    seteventId,
  } = useContext(dashboad);
  const [showPopUP, setshowPopUP] = useState(false);
  const [files, setfiles] = useState(null);
  const [loadingAction, setLoadingAction] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const response = await get_event_details(eventId);
      const details = response?.data?.data?.event_details?.[0];
      if (details) {
        setqrtext(`${APP_URL}/event/${details.user_id}/${details._id}`);
      }
    };
    fetchEventDetails();
  }, [eventId, get_event_details, setqrtext]);
  useEffect(() => {
    if (files) {
      ImageUpload();
    }
    // eslint-disable-next-line
  }, [files]);

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

  const handleQRCode = () => {
    setqrtext(`${APP_URL}/event/${event_data?.user_id}/${event_data?._id}`);
    setdownloadQR(true);
  };

  const DeleteEvent = async () => {
    setLoadingAction("delete");
    await delete_event(event_data._id);
    setLoadingAction("");
    navigate("/dashboard/event");
  };

  const ImageUpload = async () => {
    setLoadingAction("upload");
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }
    await upload_image(event_data._id, formData);
    setLoadingAction("");
  };

  const handleEditEvent = () => {
    seteventId(event_data?._id);
    seteditEvent(true);
  };

  const refreshEventDetails = async () => {
    await get_event_details(eventId);
  };

  const ShareImage = async () => {
    // console.log(object);
    if (event_data && navigator.share) {
      try {
        await navigator.share({
          title: "memois",
          url: `${APP_URL}/event/${event_data.user_id}/${event_data._id}`,
        });
      } catch (error) {
        console.log("Something went wrong while sharing");
      }
    } else {
      navigator.clipboard
        .writeText(`${APP_URL}/event/${event_data?.user_id}/${event_data?._id}`)
        .then(() => {
          alert("Link copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    }
  };

  useEffect(() => {
    if (!showPopUP) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!popupRef.current?.contains(event.target)) {
        setshowPopUP(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [showPopUP]);
  //TODO: Images show
  return (
    event_data && (
      <div className="event-details-main">
        {imageId && (
          <ItemDetails
            imageId={imageId}
            setimageId={setimageId}
            title={event_data?.EventName}
          />
        )}
        <div className="top-details-main">
          <img
            src={event_data.CoverImage ? event_data.CoverImage : ProfileImg}
            alt=""
            className="event-avatar"
          />
          <div className="details-left">
            <div className="top-text-details">
              <div className="left-text-details">
                <h5 className="main-heading">
                  {event_data?.EventName}
                  <span className="sub-heading">{event_data.EventType}</span>
                </h5>
                <div className="event-description">
                  {event_data.EventDescription}
                </div>
              </div>
              <div className="right-text-details">
                <div className="right-item-button">
                  <label htmlFor="upload">
                    <i className="bx bx-cloud-upload"></i>
                    <span className="upload-text">
                      {loadingAction === "upload" ? "Uploading..." : "Upload"}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="upload"
                    multiple
                    onChange={(e) => setfiles(e.target.files)}
                  />
                </div>
                <div className="right-item-pop-up-button">
                  <i
                    className="bx bx-dots-vertical-rounded"
                    onClick={() => {
                      setshowPopUP(!showPopUP);
                    }}
                  ></i>
                  <div
                    ref={popupRef}
                    className={`pop-up-menu ${
                      showPopUP ? "active-pop-up" : ""
                    }`}
                  >
                    <button
                      className="cross-icon"
                      onClick={() => {
                        setshowPopUP(false);
                      }}
                    >
                      <i className="bx bx-x"></i>
                    </button>

                    <button className="more-item" onClick={handleEditEvent}>
                      <i className="bx bx-edit-alt"></i>
                      <span>Edit</span>
                    </button>
                    <button className="more-item" onClick={ShareImage}>
                      <i className="bx bx-share-alt"></i>
                      <span>Share</span>
                    </button>
                    <button className="more-item" onClick={handleQRCode}>
                      <i className="bx bx-qr"></i>
                      <span>QR Code</span>
                    </button>
                    <LoadingButton
                      className="more-item"
                      loading={loadingAction === "delete"}
                      loadingText="Deleting"
                      onClick={DeleteEvent}
                    >
                      <i className="bx bx-trash"></i>
                      <span>Delete</span>
                    </LoadingButton>
                  </div>
                </div>
              </div>
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
          {event_data.image_details.length > 0 &&
            event_data.image_details.map((item) => {
              return (
                <Item
                  item={item}
                  key={item._id}
                  setimageId={setimageId}
                  onDeleteComplete={refreshEventDetails}
                />
              );
            })}
        </div>
      </div>
    )
  );
};

export default EventDetails;
