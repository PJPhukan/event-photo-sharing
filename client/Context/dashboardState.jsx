/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import { dashboad } from "./context";
import axios from "axios";
import * as faceapi from "face-api.js";

let faceModelsPromise;

const getModelBaseUrl = () => {
  const base = (import.meta.env.BASE_URL || "/").trim();
  return base.endsWith("/") ? `${base}models` : `${base}/models`;
};

const loadFaceModels = () => {
  // Cache model loading so repeated selfie matches do not re-download weights.
  if (!faceModelsPromise) {
    const MODEL_URL = getModelBaseUrl();
    faceModelsPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  }

  return faceModelsPromise;
};

const DashboardState = (props) => {
  const [qrtext, setqrtext] = useState("");
  const [event_data, setevent_data] = useState(null);
  const [eventId, seteventId] = useState(null);
  //EVENT ALL Routes

  //create event(done)
  const create_event = async (payload) => {
    try {
      const res = await axios.post("/api/event/create-event", payload);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while creating event");
    }
  };

  //delete event(done)
  const delete_event = async (eventId) => {
    try {
      const res = await axios.delete(`/api/event/delete-event/${eventId}`);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while deleting event");
    }
  };

  //edit event
  const edit_event = async (payload, eventId) => {
    try {
      const res = await axios.patch(
        `/api/event/edit-event/${eventId}`,
        payload
      );
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while editing event");
    }
  };

  //get event
  const get_event = useCallback(async () => {
    try {
      const res = await axios.get("/api/event/get-events");
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching all event");
    }
  }, []);

  //get event
  const get_event_details = useCallback(async (eventId) => {
    try {
      const res = await axios.get(`/api/event/get-event-details/${eventId}`);
      const result = res.data.data.event_details[0];
      // console.log(result);
      setevent_data(result);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching event details");
    }
  }, []);

  //DASHBOARD ROUTES

  //get total likes(done)
  const get_total_likes = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-likes");
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching total likes");
    }
  };

  //get total event(done)
  const get_total_event = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-event");
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching total event");
    }
  };

  //get total image(done)
  const get_total_image = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-image");
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching total image");
    }
  };

  //get total video(done)
  const get_total_video = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-video");
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching total video");
    }
  };

  //get event data
  const get_event_data = useCallback(async () => {
    try {
      const res = await axios.get("/api/dashboard/get-event-data");
      // console.log(response);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching event data");
    }
  }, []);

  //Images Routes

  //upload image(done)
  const upload_image = async (eventId, payload) => {
    try {
      const res = await axios.post(
        `/api/image/upload-image/${eventId}`,
        payload
      );
      // console.log("Response", res);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while uploading media");
    }
  };

  //delete image
  const delete_image = async (imageId) => {
    try {
      const res = await axios.delete(`/api/image/delete-image/${imageId}`);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while deleting image");
    }
  };

  //get image details(done)
  const get_image_details = async (imageId) => {
    try {
      const res = await axios.get(`/api/image/get-image/${imageId}`);
      // console.log("Response ", res);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while fetching image details");
    }
  };

  //LIKES ROUTES

  //new likes(done)
  const new_likes = async (payload) => {
    //url:/api/like/like-post
    try {
      const res = await axios.post("/api/like/like-post", payload);
      // console.log("Response ", res);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while liking media");
    }
  };

  //remove likes(done)
  const dislike = async (imageId) => {
    //url:/api/like/unlike-post
    try {
      // console.log(imageId);
      const res = await axios.delete(`/api/like/unlike-post/${imageId}`);
      // console.log("Response ", res);
      return res;
    } catch (err) {
      console.log(err.response?.data?.message || "Error occured while disliking media");
    }
  };

  //RECOGNITION SECTION

  const faceRecognition = async (userImage, dbimage) => {
    try {
      await loadFaceModels();
      const detectOptions = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.4,
      });
      const Reface = await faceapi.fetchImage(dbimage);

      const facesToCheck = await faceapi.fetchImage(userImage);
      let refAIData = await faceapi
        .detectAllFaces(Reface, detectOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
      let facesToCheckAIData = await faceapi
        .detectAllFaces(facesToCheck, detectOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (refAIData.length === 0 || facesToCheckAIData.length === 0) {
        return false;
      }
      // Threshold-based matching (no training needed) - LOGIC FIXED
      console.log(`🔍 Comparing ${refAIData.length} gallery faces vs ${facesToCheckAIData.length} selfie faces`);
      
      let bestMatch = 1.0; // Track closest match
      
      for (let refFace of refAIData) {
        for (let selfieFace of facesToCheckAIData) {
          const distance = faceapi.euclideanDistance(
            refFace.descriptor, 
            selfieFace.descriptor
          );
          console.log(`📏 Distance: ${distance.toFixed(3)} (threshold: <0.6)`);
          
          if (distance < bestMatch) bestMatch = distance;
          
          if (distance < 0.55) { // Tighter - filter single photos
            console.log('🎉 FACE MATCH FOUND!');
            return true;
          }
        }
      }
      console.log(`❌ No good matches. Best: ${bestMatch.toFixed(3)}`);
      return false;
    } catch (error) {
      console.log(error);
    }
  };
  const recognize = async (img, dbimage) => {
    const result = await faceRecognition(img, dbimage);
    // console.log(result);
    return result;
  };

  const get_details = async (userId, eventId) => {
    try {
      const response = await axios.get(
        `/api/face-recognition/get-details/${userId}/${eventId}`
      );
      return response?.data?.data?.event_details[0];
    } catch (error) {
      console.log("Error occured while fetching event details");
    }
  };

  //Notification

  //get all notification
  const get_all_notification = async () => {
    try {
      const response = await axios.get(
        "/api/notification/get-all-notification"
      );
      return response?.data?.data;
    } catch (error) {
      console.log("Error occured while fetching notification");
    }
  };

  //mark as read notification
  const mark_as_read = async (notificationId) => {
    try {
      const response = await axios.patch(
        `/api/notification/mark-as-read/${notificationId}`
      );
      // console.log(response);
      return response?.data?.message;
    } catch (error) {
      console.log("Error occured while marking notification as read");
    }
  };

  //delete notification
  const delete_notification = async (notificationId) => {
    try {
      const response = await axios.delete(
        `/api/notification/delete-notification/${notificationId}`
      );
      // console.log(response);
      return response?.data?.message;
    } catch (error) {
      console.log("Error occured while deleting notification");
    }
  };

  //Favorites
  const get_favorites = async () => {
    try {
      const response = await axios.get("/api/favorite");
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while fetching favorites");
    }
  };

  const add_favorite = async (payload) => {
    try {
      const response = await axios.post("/api/favorite/add", payload);
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while adding favorite");
    }
  };

  const remove_favorite = async (imageId) => {
    try {
      const response = await axios.delete(`/api/favorite/remove/${imageId}`);
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while removing favorite");
    }
  };

  //Collections
  const get_collections = async () => {
    try {
      const response = await axios.get("/api/collection");
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while fetching collections");
    }
  };

  const create_collection = async (payload) => {
    try {
      const response = await axios.post("/api/collection/create", payload);
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while creating collection");
    }
  };

  const get_collection = async (collectionId) => {
    try {
      const response = await axios.get(`/api/collection/${collectionId}`);
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while fetching collection");
    }
  };

  const delete_collection = async (collectionId) => {
    try {
      const response = await axios.delete(`/api/collection/${collectionId}`);
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while deleting collection");
    }
  };

  const add_image_to_collection = async (collectionId, imageId) => {
    try {
      const response = await axios.post(
        `/api/collection/${collectionId}/add-image`,
        { imageId }
      );
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while adding to collection");
    }
  };

  const remove_image_from_collection = async (collectionId, imageId) => {
    try {
      const response = await axios.delete(
        `/api/collection/${collectionId}/remove-image/${imageId}`
      );
      return response;
    } catch (error) {
      console.log(error.response?.data?.message || "Error occured while removing from collection");
    }
  };
  return (
    <dashboad.Provider
      value={{
        create_event,
        delete_event,
        edit_event,
        get_event,
        get_event_details,
        qrtext,
        setqrtext,
        get_total_likes,
        get_total_event,
        get_total_image,
        get_total_video,
        get_event_data,
        event_data,
        upload_image,
        delete_image,
        get_image_details,
        new_likes,
        dislike,
        eventId,
        seteventId,
        get_details,
        recognize,
        get_all_notification,
        mark_as_read,
        delete_notification,
        get_favorites,
        add_favorite,
        remove_favorite,
        get_collections,
        create_collection,
        get_collection,
        delete_collection,
        add_image_to_collection,
        remove_image_from_collection,
      }}
    >
      {props.children}
    </dashboad.Provider>
  );
};

export default DashboardState;
