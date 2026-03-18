import { useContext, useEffect, useState } from "react";
import "./favorite.scss";
import { Link } from "react-router-dom";
import { context, dashboad } from "../../../Context/context";
import ItemDetails from "../../component/ItemDetails/ItemDetails";
import LoadingButton from "../../component/LoadingButton/LoadingButton";
import { downloadMedia } from "../../lib/downloadMedia";

const Favorite = () => {
  const dashboardContext = useContext(dashboad);
  const userContext = useContext(context);
  const {
    get_favorites,
    remove_favorite,
    get_collections,
    add_image_to_collection,
  } = dashboardContext;
  const { showToast } = userContext;

  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState("");
  const [imageId, setimageId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [favRes, colRes] = await Promise.all([
      get_favorites(),
      get_collections(),
    ]);

    const favData = favRes?.data?.data || [];
    const colData = colRes?.data?.data || [];
    setFavorites(favData);
    setCollections(colData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemoveFavorite = async (favorite) => {
    if (!favorite?.image_id?._id) return;
    setLoadingAction(`remove-${favorite._id}`);
    const res = await remove_favorite(favorite.image_id._id);
    if (res?.data?.success) {
      setFavorites((current) =>
        current.filter((item) => item._id !== favorite._id)
      );
      showToast("Removed from favorites", "success");
    }
    setLoadingAction("");
  };

  const handleSelectCollection = (favoriteId, collectionId) => {
    setSelectedCollections((current) => ({
      ...current,
      [favoriteId]: collectionId,
    }));
  };

  const handleAddToCollection = async (favorite) => {
    const collectionId = selectedCollections[favorite._id];
    if (!collectionId) {
      showToast("Select a collection first", "error");
      return;
    }
    if (!favorite?.image_id?._id) return;
    setLoadingAction(`add-${favorite._id}`);
    const res = await add_image_to_collection(
      collectionId,
      favorite.image_id._id
    );
    if (res?.data?.success) {
      showToast("Added to collection", "success");
    }
    setLoadingAction("");
  };

  const handleDownload = async (favorite) => {
    const media = favorite?.image_id;
    if (!media) return;
    try {
      await downloadMedia({
        url: media.imageUrl,
        filename: media.title || "download",
        resourceType: media.resource_type,
      });
    } catch (error) {
      window.open(media.imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="favorite-page">
      {imageId && (
        <ItemDetails imageId={imageId} setimageId={setimageId} title="Favorite" />
      )}
      <div className="favorite-header">
        <div className="title-group">
          <h2>Favorites</h2>
          <p>Your saved photos and videos.</p>
        </div>
        <div className="header-actions">
          <div className="count-pill">{favorites.length} items</div>
          <Link className="manage-link" to="/dashboard/collections">
            Manage collections
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="favorite-empty">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="favorite-empty">
          <div className="empty-icon">
            <i className="bx bx-heart"></i>
          </div>
          <h3>No favorites yet</h3>
          <p>Tap the heart or bookmark on any media to save it here.</p>
        </div>
      ) : (
        <div className="favorite-grid">
          {favorites.map((favorite) => {
            const media = favorite.image_id;
            if (!media) return null;

            return (
              <div className="favorite-card" key={favorite._id}>
                <button
                  className="favorite-preview"
                  onClick={() => setimageId(media._id)}
                >
                  {media.resource_type === "image" ? (
                    <img src={media.imageUrl} alt={media.title || "Favorite"} />
                  ) : (
                    <video muted>
                      <source src={media.imageUrl} type="video/mp4" />
                    </video>
                  )}
                  <span className="favorite-type">
                    {media.resource_type === "image" ? "Photo" : "Video"}
                  </span>
                </button>
                <div className="favorite-info">
                  <div className="favorite-meta">
                    <div className="favorite-title">
                      {media.title || "Untitled"}
                    </div>
                    <div className="favorite-type-pill">
                      {media.resource_type === "image" ? "Photo" : "Video"}
                    </div>
                  </div>
                  <div className="favorite-actions">
                    <LoadingButton
                      className="ghost-btn"
                      loading={loadingAction === `remove-${favorite._id}`}
                      loadingText="Removing"
                      onClick={() => handleRemoveFavorite(favorite)}
                    >
                      <i className="bx bx-x"></i>
                      Remove
                    </LoadingButton>
                    <button
                      className="ghost-btn"
                      onClick={() => handleDownload(favorite)}
                    >
                      <i className="bx bx-download"></i>
                      Download
                    </button>
                  </div>
                  <div className="favorite-collection">
                    <select
                      value={selectedCollections[favorite._id] || ""}
                      onChange={(event) =>
                        handleSelectCollection(favorite._id, event.target.value)
                      }
                    >
                      <option value="">Add to collection</option>
                      {collections.length === 0 && (
                        <option value="" disabled>
                          Create a collection first
                        </option>
                      )}
                      {collections.map((collection) => (
                        <option value={collection._id} key={collection._id}>
                          {collection.collectionName}
                        </option>
                      ))}
                    </select>
                    <LoadingButton
                      className="primary-btn"
                      loading={loadingAction === `add-${favorite._id}`}
                      loadingText="Adding"
                      onClick={() => handleAddToCollection(favorite)}
                      disabled={collections.length === 0}
                    >
                      Add
                    </LoadingButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Favorite;
