import { useContext, useEffect, useMemo, useState } from "react";
import "./selfie.scss";
import ProfileImg from "../../assets/collLogo.png";
import ClickSelfie from "../../component/ClickSelfie/ClickSelfie";
import { useParams } from "react-router-dom";
import { dashboad } from "../../../Context/context";
import SelfieItem from "../../component/SelfieItem/SelfieItem";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const Selfie = () => {
  const PAGE_SIZE = 12;
  const [takeSelfie, settakeSelfie] = useState(false);
  const { get_details } = useContext(dashboad);
  const { userId, eventId } = useParams();
  const [event_data, setevent_data] = useState(null);
  const [fetchData, setfetchData] = useState(null);
  const [loading, setloading] = useState(false);
  const [userImage, setuserImage] = useState(null);
  const [isSearchingResults, setIsSearchingResults] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const getEventDetails = async () => {
    setIsGalleryLoading(true);
    const result = await get_details(userId, eventId);
    setevent_data(result);
    setfetchData(result?.image_details || []);
    setIsGalleryLoading(false);
    return result;
  };

  useEffect(() => {
    const fn = async () => {
      await getEventDetails();
    };
    fn();
  }, [eventId, userId]);

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

  const refreshGallery = async () => {
    setIsRefreshing(true);
    const result = await getEventDetails();
    if (result) {
      setuserImage(null);
      setIsSearchingResults(false);
      setVisibleCount(PAGE_SIZE);
    }
    setIsRefreshing(false);
  };

  const eventCoverImage = event_data?.CoverImage || ProfileImg;
  const eventName = event_data?.EventName || "Event";
  const eventType = event_data?.EventType || "";
  const eventDescription = event_data?.EventDescription || "";
  const eventDate = event_data?.EventDate;
  const eventContact = event_data?.ContactDetails || "";
  const eventLocation = event_data?.EventLocation || "";

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [userImage, fetchData]);

  const activeItems = useMemo(() => {
    if (isSearchingResults && userImage !== null) {
      return userImage || [];
    }
    return fetchData || [];
  }, [fetchData, userImage, isSearchingResults]);

  const visibleItems = activeItems.slice(0, visibleCount);
  const hasMoreItems = activeItems.length > visibleCount;

  if (isGalleryLoading) {
    return (
      <div className="selfie">
        <div className="gallery-loading-state">
          <div className="gallery-loading-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="gallery-skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!event_data) {
    return (
      <div className="selfie">
        <div className="gallery-empty-state">
          <div className="gallery-empty-title">Event not available</div>
          <div className="gallery-empty-text">
            This event link may be invalid or the gallery could not be loaded right now.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="selfie">
      {takeSelfie && fetchData && (
        <ClickSelfie
          settakeSelfie={settakeSelfie}
          fetchData={fetchData}
          setuserImage={setuserImage}
          setloading={setloading}
          setIsSearchingResults={setIsSearchingResults}
        />
      )}
      <div className="top-details-main">
        <img
          src={eventCoverImage}
          alt={eventName}
          className="event-avatar"
        />
        <div className="details-left">
          <div className="top-text-details">
            <div className="left-text-details">
              <h5 className="main-heading">
                {eventName}
                <span className="sub-heading">{eventType}</span>
              </h5>
              <div className="event-description">{eventDescription}</div>
            </div>
            <div className="selfie-actions">
              <LoadingButton
                className="refresh-gallery"
                type="button"
                loading={isRefreshing}
                loadingText="Refreshing"
                onClick={refreshGallery}
              >
                <i className="bx bx-refresh"></i>
                <span className="upload-text">Refresh</span>
              </LoadingButton>
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
          </div>
          <div className="mobile-desc">{eventDescription}</div>
          <div className="address-container">
            <div className="address-box">
              <i className="bx bx-calendar"></i>
              <span>{eventDate ? returnTimeDate(eventDate) : "Date unavailable"}</span>
            </div>
            <div className="address-box">
              <i className="bx bx-phone"></i>
              <span>
                <span className="country-code">+91</span>
                <span>{eventContact}</span>
              </span>
            </div>
            <div className="address-box">
              <i className="bx bx-map"></i>
              <span>{eventLocation}</span>
            </div>
          </div>
        </div>
      </div>
      
      {isSearchingResults && (
        <div className="search-results-header">
          <h3>Search Results - {userImage?.length || 0}</h3>
          <LoadingButton
            className="clear-search"
            type="button"
            onClick={() => {
              setuserImage(null);
              setIsSearchingResults(false);
            }}
          >
            Clear
          </LoadingButton>
        </div>
      )}
      
      <div className="event-items">
        {loading ? (
          <div className="searching-state">
            <div className="searching-visual">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="searching-title">Searching your photos</div>
            <div className="searching-text">
              Matching your selfie against this event gallery. This can take a moment.
            </div>
          </div>
        ) : activeItems.length === 0 ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-title">No media available yet</div>
            <div className="gallery-empty-text">
              The event owner has not uploaded photos or videos yet. Use refresh to check again.
            </div>
          </div>
        ) : userImage?.length === 0 && isSearchingResults ? (
          <div className="gallery-empty-state">
            <div className="gallery-empty-title">No matches found</div>
            <div className="gallery-empty-text">
              No faces matched your selfie. Try different angle/lighting or clear search.
            </div>
          </div>
        ) : (
          <>
            {visibleItems.map((item) => (
              <SelfieItem item={item} key={item._id} />
            ))}
            {hasMoreItems && (
              <div className="gallery-pagination">
                <LoadingButton
                  className="load-more"
                  type="button"
                  onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                >
                  Load More
                </LoadingButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Selfie;

