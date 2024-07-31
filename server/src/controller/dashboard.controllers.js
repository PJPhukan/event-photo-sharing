import mongoose from "mongoose";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../model/likes.model.js";
import { Event } from "../model/event.model.js";
import { Image } from "../model/image.model.js";

const GetTotalLike = AsyncHandler(async (req, res) => {
  const { _id } = req.user._id;

  const TotalLike = await Like.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $count: "totalLikes",
    },
  ]);
  // console.log("Print total likes: ", TotalLike);
  if (TotalLike.length >= 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, TotalLike, "Successfully like data fetched"));
  }
  throw new ApiError(500, "Error occured while fetching likes");
});

const GetTotalEvent = AsyncHandler(async (req, res) => {
  const { _id } = req.user._id;

  const TotalEvent = await Event.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $count: "totalEvents",
    },
  ]);
  // console.log("Print Total Event :", TotalEvent);
  if (TotalEvent.length >= 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, TotalEvent, "Successfully event data fetched")
      );
  }
  throw new ApiError(500, "Error occured while fetching Event");
});

const GetTotalImages = AsyncHandler(async (req, res) => {
  const { _id } = req.user._id;

  const TotalImages = await Image.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(_id),
        resource_type: "image",
      },
    },
    {
      $count: "totalImage",
    },
  ]);
  // console.log("Print Total Images:  ", TotalImages);
  if (TotalImages.length >= 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, TotalImages, "Successfully images data fetched")
      );
  }
  throw new ApiError(500, "Error occured while fetching number of images");
});

const GetTotalVideos = AsyncHandler(async (req, res) => {
  const { _id } = req.user._id;

  const TotalVideo = await Image.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(_id),
        resource_type: "video",
      },
    },
    {
      $count: "totalVideo",
    },
  ]);
  // console.log("Print number of total videos: ", TotalVideo);
  if (TotalVideo || TotalVideo === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, TotalVideo, "Successfully video data fetched")
      );
  }
  throw new ApiError(500, "Error occured while fetching number of videos");
});

const GetEventData = AsyncHandler(async (req, res) => {
  const { _id } = req.user._id;

  const combined_details = await Event.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "event_id",
        as: "image_details",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "image",
              as: "likes",
              pipeline: [
                {
                  $count: "totallikes",
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "event_id",
        as: "resource_type_details",
        pipeline: [
          {
            $group: {
              _id: "$resource_type",
              count: {
                $sum: 1,
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "event_id",
        as: "likes_details",
        pipeline: [
          {
            $count: "totallikes",
          },
        ],
      },
    },
    {
      $project: {
        EventName: 1,
        EventDate: 1,
        image_details: 1,
        resource_type_details: 1,
        likes_details: 1,
      },
    },
  ]);

  // console.log("Displaying combine details of event data :", combined_details);

  if (combined_details.length >= 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { event_details: combined_details },
          "Successfully data fetched"
        )
      );
  }
  throw new ApiError(500, "Error occured while fetching event data");
});
export {
  GetTotalLike,
  GetTotalEvent,
  GetTotalImages,
  GetTotalVideos,
  GetEventData,
};
