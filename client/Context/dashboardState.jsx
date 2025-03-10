import { useEffect, useState } from "react";
import { dashboad } from "./context";
import axios from "axios";
import * as faceapi from "face-api.js";

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
      console.log("Error occured while creating event");
      console.log(err.response.data.message);
    }
  };

  //delete event(done)
  const delete_event = async (eventId) => {
    try {
      const res = await axios.delete(`/api/event/delete-event/${eventId}`);
      return res;
    } catch (err) {
      console.log("Error occured while deleting event :");
      console.log(err.response.data.message);
    }
  };

  //edit event
  const edit_event = async (payload, eventId) => {
    try {
      const res = await axios.patch(
        `/api/event/edit-event/${eventId}`,
        payload
      );
      console.log("Response:", res);
    } catch (err) {
      console.log("Error occured while editing event :");
      console.log(err.response.data.message);
    }
  };

  //get event
  const get_event = async () => {
    try {
      const res = await axios.get("/api/event/get-events");
      return res;
    } catch (err) {
      console.log("Error occured while fetching all event :");
      console.log(err.response.data.message);
    }
  };

  //get event
  const get_event_details = async (eventId) => {
    try {
      const res = await axios.get(`/api/event/get-event-details/${eventId}`);
      const result = res.data.data.event_details[0];
      // console.log(result);
      setevent_data(result);
      return res;
    } catch (err) {
      console.log("Error occured while fetching event details :");
      console.log(err.response.data.message);
    }
  };

  //DASHBOARD ROUTES

  //get total likes(done)
  const get_total_likes = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-likes");
      return res;
    } catch (err) {
      console.log("Error occured while fetching total likes :");
      console.log(err.response.data.message);
    }
  };

  //get total event(done)
  const get_total_event = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-event");
      return res;
    } catch (err) {
      console.log("Error occured while fetching total event :");
      console.log(err.response.data.message);
    }
  };

  //get total image(done)
  const get_total_image = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-image");
      return res;
    } catch (err) {
      console.log("Error occured while fetching total image :");
      console.log(err.response.data.message);
    }
  };

  //get total video(done)
  const get_total_video = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-total-video");
      return res;
    } catch (err) {
      console.log("Error occured while fetching total video :");
      console.log(err.response.data.message);
    }
  };

  //get event data
  const get_event_data = async () => {
    try {
      const res = await axios.get("/api/dashboard/get-event-data");
      // console.log(response);
      return res;
    } catch (err) {
      console.log("Error occured while fetching event data :");
      console.log(err.response.data.message);
    }
  };

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
      console.log("Error occured while uploading image/videos:");
      console.log(err.response.data.message);
    }
  };

  //delete image
  const delete_image = async (imageId) => {
    try {
      const res = await axios.get(`/api/image/delete-image/${imageId}`);
      console.log("Response :", res);
      return res;
    } catch (err) {
      console.log("Error occured while deleting image :");
      console.log(err.response.data.message);
    }
  };

  //get image details(done)
  const get_image_details = async (imageId) => {
    try {
      const res = await axios.get(`/api/image/get-image/${imageId}`);
      // console.log("Response ", res);
      return res;
    } catch (err) {
      console.log("Error occured while fetching image details :");
      console.log(err.response.data.message);
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
      console.log("Error occured while user liked in picture:");
      console.log(err.response.data.message);
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
      console.log("Error occured while user disliked in picture:");
      console.log(err.response.data.message);
    }
  };

  //RECOGNITION SECTION

  const faceRecognition = async (userImage, dbimage) => {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      const Reface = await faceapi.fetchImage(dbimage);

      const facesToCheck = await faceapi.fetchImage(userImage);
      let refAIData = await faceapi
        .detectAllFaces(Reface)
        .withFaceLandmarks()
        .withFaceDescriptors();
      let facesToCheckAIData = await faceapi
        .detectAllFaces(facesToCheck)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (refAIData.length === 0 || facesToCheckAIData.length === 0) {
        return false;
      }
      let faceMatcher = new faceapi.FaceMatcher(refAIData);
      for (let face of facesToCheckAIData) {
        const { descriptor } = face;
        let label = faceMatcher.findBestMatch(descriptor).toString();

        if (!label.includes("unknown")) {
          return true;
        }
      }
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
      }}
    >
      {props.children}
    </dashboad.Provider>
  );
};

export default DashboardState;
