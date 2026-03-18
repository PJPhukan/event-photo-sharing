import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./topbar.scss";
import ProfileImage from "../../assets/profile.jpg";
import { Link, useNavigate } from "react-router-dom";
import { context, dashboad } from "../../../Context/context";
import Notification from "../Notification/Notification";
import UploadMedia from "../UploadMedia/UploadMedia";
const Topbar = () => {
  const UserContext = useContext(context);
  const dashboardContext = useContext(dashboad);
  const {
    showSidebar,
    setshowSidebar,
    user,
    showNotification,
    setshowNotification,
  } = UserContext;
  const { get_event, get_collections } = dashboardContext;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {}, [user]);
  const ToggleNotification = () => {
    setshowNotification(!showNotification);
  };

  const loadSearchData = async () => {
    setIsLoading(true);
    const [eventsRes, collectionsRes] = await Promise.all([
      get_event(),
      get_collections(),
    ]);
    setEvents(eventsRes?.data?.data || []);
    setCollections(collectionsRes?.data?.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }
    loadSearchData();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return { eventMatches: [], collectionMatches: [] };
    }
    const eventMatches = events.filter((event) =>
      `${event.EventName || ""} ${event.EventType || ""}`
        .toLowerCase()
        .includes(value)
    );
    const collectionMatches = collections.filter((collection) =>
      (collection.collectionName || "").toLowerCase().includes(value)
    );
    return { eventMatches, collectionMatches };
  }, [query, events, collections]);

  const handleEventClick = (eventId) => {
    setIsSearchOpen(false);
    setQuery("");
    navigate(`/dashboard/event/${eventId}`);
  };

  const handleCollectionClick = (collectionId) => {
    setIsSearchOpen(false);
    setQuery("");
    navigate(`/dashboard/collections/${collectionId}`);
  };

  return (
    <div className="top-bar">
      <div className="left">
        <i
          className="bx bx-menu"
          onClick={() => setshowSidebar((prev) => !prev)}
        ></i>
        <div className="search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search events or collections"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setIsSearchOpen(true)}
          />
          <i className="bx bx-search-alt-2"></i>
          {isSearchOpen && (
            <div className="search-dropdown">
              {isLoading ? (
                <div className="search-state">Loading...</div>
              ) : !query.trim() ? (
                <div className="search-state">
                  Start typing to search events or collections.
                </div>
              ) : (
                <>
                  <div className="search-section">
                    <div className="search-section-title">Events</div>
                    {results.eventMatches.length === 0 ? (
                      <div className="search-empty">No matching events</div>
                    ) : (
                      results.eventMatches.slice(0, 5).map((event) => (
                        <button
                          key={event._id}
                          className="search-item"
                          onClick={() => handleEventClick(event._id)}
                        >
                          <span className="search-item-title">
                            {event.EventName}
                          </span>
                          <span className="search-item-sub">
                            {event.EventType}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="search-section">
                    <div className="search-section-title">Collections</div>
                    {results.collectionMatches.length === 0 ? (
                      <div className="search-empty">No matching collections</div>
                    ) : (
                      results.collectionMatches.slice(0, 5).map((collection) => (
                        <button
                          key={collection._id}
                          className="search-item"
                          onClick={() =>
                            handleCollectionClick(collection._id)
                          }
                        >
                          <span className="search-item-title">
                            {collection.collectionName}
                          </span>
                          <span className="search-item-sub">
                            {collection.images?.length || 0} items
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <button className="icon upload-trigger" onClick={() => setShowUpload(true)}>
          <i className="bx bx-plus"></i>
        </button>
        <i className="bx bxs-bell" onClick={ToggleNotification}></i>

        <Link to="/dashboard/profile" className="ProfileImage">
          <img src={user ? user.avatar : ProfileImage} alt="" />
        </Link>
      </div>
      <Notification />
      <UploadMedia open={showUpload} onClose={() => setShowUpload(false)} />
    </div>
  );
};

export default Topbar;
