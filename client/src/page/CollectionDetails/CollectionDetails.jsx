import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./collectiondetails.scss";
import { dashboad } from "../../../Context/context";
import Item from "../../component/Item/Item";
import ItemDetails from "../../component/ItemDetails/ItemDetails";
import LoadingButton from "../../component/LoadingButton/LoadingButton";
import { downloadMedia } from "../../lib/downloadMedia";

const CollectionDetails = () => {
  const { collectionId } = useParams();
  const dashboardContext = useContext(dashboad);
  const { get_collection, remove_image_from_collection } = dashboardContext;
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [imageId, setimageId] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  const loadCollection = async () => {
    setLoading(true);
    const res = await get_collection(collectionId);
    setCollection(res?.data?.data || null);
    setLoading(false);
  };

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  const handleDownload = async (item) => {
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

  const handleRemove = async (imageIdValue) => {
    setActionLoading(imageIdValue);
    await remove_image_from_collection(collectionId, imageIdValue);
    setActionLoading("");
    await loadCollection();
  };

  return (
    <section className="collection-details">
      {imageId && (
        <ItemDetails
          imageId={imageId}
          setimageId={setimageId}
          title={collection?.collectionName || "Collection"}
        />
      )}
      <div className="collection-header">
        <div>
          <h2>{collection?.collectionName || "Collection"}</h2>
          <p>{collection?.images?.length || 0} items</p>
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            <i className="bx bx-grid-alt"></i>
            Grid
          </button>
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            <i className="bx bx-table"></i>
            Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className="collection-empty">Loading collection...</div>
      ) : !collection ? (
        <div className="collection-empty">Collection not found.</div>
      ) : viewMode === "grid" ? (
        <div className="collection-grid">
          {collection.images?.map((item) => (
            <Item
              key={item._id}
              item={item}
              setimageId={setimageId}
            />
          ))}
        </div>
      ) : (
        <div className="collection-table">
          <table>
            <thead>
              <tr>
                <th>Media</th>
                <th>Type</th>
                <th>Likes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collection.images?.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="media-cell">
                      {item.resource_type === "image" ? (
                        <img src={item.imageUrl} alt="" />
                      ) : (
                        <video muted playsInline preload="metadata">
                          <source src={item.imageUrl} type="video/mp4" />
                        </video>
                      )}
                      <span>{item.title || "Untitled"}</span>
                    </div>
                  </td>
                  <td>{item.resource_type}</td>
                  <td>{item.likes?.length || 0}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => setimageId(item._id)}>View</button>
                      <button onClick={() => handleDownload(item)}>
                        Download
                      </button>
                      <LoadingButton
                        loading={actionLoading === item._id}
                        loadingText="Removing"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </LoadingButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CollectionDetails;
