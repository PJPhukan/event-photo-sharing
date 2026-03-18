import { useContext, useEffect, useRef, useState } from "react";
import "./collectionpicker.scss";
import LoadingButton from "../LoadingButton/LoadingButton";
import { context, dashboad } from "../../../Context/context";

const CollectionPicker = ({ open, onClose, imageId, anchor = "right" }) => {
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { get_collections, add_image_to_collection } = dashboardContext;
  const { showToast } = userContext;

  const [collections, setCollections] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      const res = await get_collections();
      const list = res?.data?.data || [];
      setCollections(list);
      if (list.length === 1 && imageId) {
        setLoading(true);
        const autoRes = await add_image_to_collection(list[0]._id, imageId);
        if (autoRes?.data?.success) {
          showToast("Added to collection", "success");
          onClose();
        }
        setLoading(false);
      }
    };
    load();
  }, [open, get_collections, add_image_to_collection, imageId, onClose, showToast]);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutsideClick = (event) => {
      if (!modalRef.current?.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open, onClose]);

  const handleSave = async () => {
    if (!selectedId) {
      showToast("Select a collection", "error");
      return;
    }
    if (!imageId) return;
    setLoading(true);
    const res = await add_image_to_collection(selectedId, imageId);
    if (res?.data?.success) {
      showToast("Added to collection", "success");
      onClose();
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="collection-picker-overlay">
      <div
        className={`collection-picker anchor-${anchor}`}
        ref={modalRef}
      >
        <div className="picker-header">
          <h3>Add to collection</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>
        <div className="picker-body">
          {collections.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bx bx-collection"></i>
              </div>
              <p>Create a collection first.</p>
            </div>
          ) : collections.length === 1 ? (
            <div className="single-state">
              <div className="single-icon">
                <i className="bx bx-collection"></i>
              </div>
              <p>Adding to your collection...</p>
            </div>
          ) : (
            <div className="collection-list">
              {collections.map((collection) => (
                <label className="collection-row" key={collection._id}>
                  <input
                    type="radio"
                    name="collection"
                    value={collection._id}
                    checked={selectedId === collection._id}
                    onChange={() => setSelectedId(collection._id)}
                  />
                  <span className="collection-name">
                    {collection.collectionName}
                  </span>
                  <span className="collection-count">
                    {collection.images?.length || 0}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        {collections.length > 1 && (
          <div className="picker-footer">
            <LoadingButton
              className="primary-btn"
              loading={loading}
              loadingText="Saving"
              onClick={handleSave}
              disabled={collections.length === 0}
            >
              Save
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPicker;
