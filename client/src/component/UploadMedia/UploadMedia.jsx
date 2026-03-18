import { useContext, useEffect, useRef, useState } from "react";
import "./uploadmedia.scss";
import LoadingButton from "../LoadingButton/LoadingButton";
import { context, dashboad } from "../../../Context/context";

const UploadMedia = ({ open, onClose }) => {
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { get_event, upload_image } = dashboardContext;
  const { showToast } = userContext;

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const loadEvents = async () => {
      setLoadingEvents(true);
      const res = await get_event();
      setEvents(res?.data?.data || []);
      setLoadingEvents(false);
    };
    loadEvents();
  }, [open, get_event]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!eventId) {
      showToast("Select an event first", "error");
      return;
    }
    if (!files.length) {
      showToast("Select at least one file", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("image", file);
    });
    const res = await upload_image(eventId, formData);
    if (res?.data?.success) {
      showToast("Upload complete", "success");
      setEventId("");
      setFiles([]);
      onClose();
    }
    setLoading(false);
  };

  const handleFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    setFiles((current) => {
      const merged = [...current, ...incoming];
      const unique = Array.from(new Map(merged.map((f) => [f.name + f.size, f])).values());
      return unique;
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!eventId) {
      showToast("Select an event first", "error");
      return;
    }
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!eventId) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

  const uploadDisabled = !eventId || loading || loadingEvents;

  return (
    <div className="upload-media-overlay">
      <div className="upload-media-modal" ref={modalRef}>
        <div className="modal-header">
          <div>
            <h3>Upload media</h3>
            <p>Choose an event and upload photos or videos.</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={loadingEvents}
            >
              <option value="">Select event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.EventName}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`dropzone ${isDragging ? "dragging" : ""} ${
              uploadDisabled ? "disabled" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!uploadDisabled) {
                fileInputRef.current?.click();
              } else {
                showToast("Select an event first", "error");
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              disabled={uploadDisabled}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="dropzone-inner">
              <div className="drop-icon">
                <i className="bx bx-cloud-upload"></i>
              </div>
              <h4>Drag & drop your files here</h4>
              <p>or click to browse (images & videos)</p>
              <span className="drop-hint">
                {eventId
                  ? files.length
                    ? `${files.length} file(s) selected`
                    : "Upload will start after you click Upload"
                  : "Select an event to enable uploads"}
              </span>
            </div>
          </div>
          {files.length > 0 && (
            <div className="file-row">
              <span>{files.length} files ready</span>
              <button type="button" onClick={clearFiles}>
                Clear
              </button>
            </div>
          )}
          <div className="modal-actions">
            <LoadingButton
              type="button"
              className="ghost-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              className="primary-btn"
              loading={loading}
              loadingText="Uploading"
              disabled={!eventId || files.length === 0}
            >
              Upload
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMedia;
