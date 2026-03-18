import { useContext, useEffect, useRef, useState } from "react";
import "./createcollection.scss";
import LoadingButton from "../LoadingButton/LoadingButton";
import { context, dashboad } from "../../../Context/context";

const CreateCollection = ({ open, onClose, onCreated }) => {
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { create_collection } = dashboardContext;
  const { showToast } = userContext;

  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      showToast("Collection name is required", "error");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }
    const res = await create_collection(formData);
    if (res?.data?.success) {
      showToast("Collection created", "success");
      setName("");
      setCoverFile(null);
      onCreated?.();
      onClose();
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="create-collection-overlay">
      <div className="create-collection-modal" ref={modalRef}>
        <div className="modal-header">
          <div>
            <h3>Create collection</h3>
            <p>Organize your favorite media in one place.</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Collection name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Wedding highlights"
            />
          </div>
          <div className="field">
            <label>Cover image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </div>
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
              loadingText="Creating"
            >
              Create
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollection;
