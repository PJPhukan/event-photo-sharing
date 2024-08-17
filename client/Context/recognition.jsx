import { useState } from "react";
import { recognition } from "./context";
import * as faceapi from "face-api.js";
import axios from "axios";
const RecognitionState = (props) => {
  //get details
  const [data, setdata] = useState("hello");
  // const faceRecognition = async (userImage) => {
  //   await Promise.all([
  //     faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
  //     faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  //     faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
  //   ]);

  //   const Reface = await faceapi.fetchImage(
  //     "https://th.bing.com/th/id/OIP.j8yd8dJ5215WbgQ0NsLzuAHaNK?rs=1&pid=ImgDetMain"
  //   );

  //   const facesToCheck = await faceapi.fetchImage(userImage);

  //   let refAIData = await faceapi
  //     .detectAllFaces(Reface)
  //     .withFaceLandmarks()
  //     .withFaceDescriptors();
  //   let facesToCheckAIData = await faceapi
  //     .detectAllFaces(facesToCheck)
  //     .withFaceLandmarks()
  //     .withFaceDescriptors();

  //   if (refAIData.length === 0 || facesToCheckAIData.length === 0) {
  //     return false;
  //   }

  //   let faceMatcher = new faceapi.FaceMatcher(refAIData);

  //   for (let face of facesToCheckAIData) {
  //     const { descriptor } = face;
  //     let label = faceMatcher.findBestMatch(descriptor).toString();

  //     if (!label.includes("unknown")) {
  //       return true;
  //     }
  //   }

  //   return false;
  // };
  // const recognize = async () => {
  //   const result = await faceRecognition(
  //     "https://th.bing.com/th/id/OIP.j8yd8dJ5215WbgQ0NsLzuAHaNK?rs=1&pid=ImgDetMain"
  //   );
  //   console.log(result);
  // };
  // recognize();

  // const get_details = async (userId, eventId) => {
  //   try {
  //     const response = await axios.get(
  //       `/api/face-recognition/get-details/${userId}/${eventId}`
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log("Error occured while fetching event details");
  //   }
  // };

  // const like = async (payload) => {
  //   try {
  //     //payload=owner, imageId, eventId
  //     const response = await axios.post(
  //       "/api/face-recognition/like-image",
  //       payload
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log("Error occured while liking event");
  //   }
  // };

  // const dislike = async (imageId) => {
  //   try {
  //     //payload=owner, imageId, eventId
  //     const response = await axios.patch(
  //       `/api/face-recognition/dislike-image/${imageId}`
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.log("Error occured while dis-liking event");
  //   }
  // };

  // <recognition.Provider value={{ get_details, like, dislike,data }}>
  <recognition.Provider value={{ data }}>
    {props.children}
  </recognition.Provider>;
};

export  {RecognitionState};
