import { useContext, useEffect, useState } from "react";
import "./collections.scss";
import { Link, useNavigate } from "react-router-dom";
import { context, dashboad } from "../../../Context/context";
import CreateCollection from "../../component/CreateCollection/CreateCollection";
import LoadingButton from "../../component/LoadingButton/LoadingButton";

const Collections = () => {
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const { get_collections, delete_collection } = dashboardContext;
  const { showToast } = userContext;

  const [collections, setCollections] = useState([]);
  const [loadingAction, setLoadingAction] = useState("");
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const loadCollections = async () => {
    const res = await get_collections();
    setCollections(res?.data?.data || []);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleDeleteCollection = async (collectionId) => {
    setLoadingAction(`delete-${collectionId}`);
    const res = await delete_collection(collectionId);
    if (res?.data?.success) {
      showToast("Collection deleted", "success");
      setCollections((current) =>
        current.filter((collection) => collection._id !== collectionId)
      );
    }
    setLoadingAction("");
  };

  return (
    <section className="collections-page">
      <div className="collections-header">
        <div className="title-group">
          <h2>Collections</h2>
          <p>Organize your favorite media in custom sets.</p>
        </div>
        <button
          className="primary-btn add-collection-btn"
          onClick={() => setShowCreate(true)}
        >
          Add collection
        </button>
      </div>

      <div className="collections-layout">
        <div className="collections-panel">
          <div className="panel-card">
            <div className="panel-header">
              <h3>Your collections</h3>
            </div>

            {collections.length === 0 ? (
              <div className="empty-block">
                <div className="empty-icon">
                  <i className="bx bx-collection"></i>
                </div>
                <p className="muted">No collections yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="collection-list">
                {collections.map((collection) => (
                  <div
                    className="collection-item"
                    key={collection._id}
                    onClick={() =>
                      navigate(`/dashboard/collections/${collection._id}`)
                    }
                  >
                    <div className="collection-cover">
                      {collection.coverImage ? (
                        <img
                          src={collection.coverImage}
                          alt={collection.collectionName}
                        />
                      ) : (
                        <div className="cover-fallback">
                          {collection.collectionName.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="collection-info">
                      <div className="collection-name">
                        {collection.collectionName}
                      </div>
                      <div className="collection-count">
                        {collection.images?.length || 0} items
                      </div>
                    </div>
                    <div className="collection-actions">
                      <LoadingButton
                        className="ghost-btn"
                        loading={loadingAction === `view-${collection._id}`}
                        loadingText="Loading"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/dashboard/collections/${collection._id}`);
                        }}
                      >
                        View
                      </LoadingButton>
                      <LoadingButton
                        className="ghost-btn danger"
                        loading={loadingAction === `delete-${collection._id}`}
                        loadingText="Deleting"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteCollection(collection._id);
                        }}
                      >
                        Delete
                      </LoadingButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="collections-detail">
          <div className="panel-card">
            <h3>Collections overview</h3>
            <div className="empty-block">
              <div className="empty-icon">
                <i className="bx bx-photo-album"></i>
              </div>
              <p className="muted">
                Select a collection to view items. Collections open in a dedicated page.
              </p>
              <Link className="primary-link" to="/dashboard/favorite">
                Go to Favorites
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CreateCollection
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadCollections}
      />
    </section>
  );
};

export default Collections;
