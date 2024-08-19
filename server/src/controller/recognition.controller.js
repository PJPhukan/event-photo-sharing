import { Event } from "../model/event.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import { Like } from "../model/likes.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const GetDetails = AsyncHandler(async (req, res) => {
  const { userId, eventId } = req.params;
  // console.log("userId: ", userId);
  if (!userId || !eventId) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // console.log(user);
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }
  // console.log(event);
  const combined_details = await Event.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(eventId),
        user_id: new mongoose.Types.ObjectId(userId),
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
            },
          },
        ],
      },
    },
  ]);

  // console.log("Print Combined details:", combined_details);

  if (combined_details.length >= 0) {
    // console.log("Succefully data send");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { event_details: combined_details },
          "Successfully details fetched"
        )
      );
  }
  throw new ApiError(500, "Error occured while fetching events");
});

const UserLike = AsyncHandler(async (req, res) => {
  const { _id, username, avatar } = req.user;
  const { owner, imageId, eventId } = req.body;
  const like = await Like.findOne({ likedUser: _id, image: imageId });
  
  console.log(like);
  const image = await Image.findById(imageId);

  if (like) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "You are already liked"));
  }
  const newLike = await Like.create({
    likedUser: _id,
    user: owner,
    image: imageId,
    event_id: eventId,
  });
  if (!newLike) {
    throw new ApiError(500, "Failed to create like");
  }
  console.log(newLike);

  //Add congratulation message to user
  const LikeResponse = await Notification.create({
    message: `${username} liked your ${
      image.resource_type ? image.resource_type : "photo"
    }.`,
    owner_id: owner,
    imageId: imageId,
    username: username,
    type: "like",
    avatar,
  });

  console.log("Like Response from recogition");
  return res.status(200).json(new ApiResponse(200, "User liked successfully"));
});

const UserDislike = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { imageId } = req.params;
  // console.log(imageId);
  let like = await Like.findOne({ likedUser: _id, image: imageId });
  // console.log(like);
  if (!like) {
    throw new ApiError(400, "You did not liked yet");
  }
  like = await Like.deleteOne({ likedUser: _id, image: imageId });
  if (!like) {
    throw new ApiError(500, "Failed to dislike the media");
  }
  //delete notification that user
  const deleteLikeNotification = await Notification.deleteOne({
    user_id: _id,
    username,
    imageId,
  });

  console.log("Delete notification result ", deleteLikeNotification);

  return res
    .status(200)
    .json(new ApiResponse(200, "User disliked successfully"));
});

export { GetDetails, UserLike, UserDislike };
