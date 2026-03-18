import { User } from "../model/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../model/likes.model.js";
import { Notification } from "../model/notification.model.js";
import { Image } from "../model/image.model.js";
import mongoose from "mongoose";
const NewLike = AsyncHandler(async (req, res) => {
  const { _id, username, avatar } = req.user;
  const { owner, imageId, eventId } = req.body;
  if (!owner || !imageId || !eventId) {
    throw new ApiError(400, "owner, imageId and eventId are required");
  }
  if (
    !mongoose.Types.ObjectId.isValid(owner) ||
    !mongoose.Types.ObjectId.isValid(imageId) ||
    !mongoose.Types.ObjectId.isValid(eventId)
  ) {
    throw new ApiError(400, "Invalid owner, image, or event id");
  }

  const like = await Like.findOne({ likedUser: _id, image: imageId });
  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }
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

  
  if (image.user_id.toString() !== _id.toString()) {
    await Notification.create({
      message: `${username} liked your ${
        image.resource_type ? image.resource_type : "photo"
      }.`,
      owner_id: owner,
      imageId: imageId,
      username: username,
      type: "like",
      avatar,
    });
  }

  return res.status(200).json(new ApiResponse(200, "User liked successfully"));
});

const DeleteLike = AsyncHandler(async (req, res) => {
  const { _id, username } = req.user;
  const { imageId } = req.params;
  // console.log(imageId);
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new ApiError(400, "Invalid image id");
  }
  const existingLike = await Like.findOne({ likedUser: _id, image: imageId });
  // console.log(like);
  if (!existingLike) {
    throw new ApiError(400, "You did not liked yet");
  }
  const deleteResult = await Like.deleteOne({ likedUser: _id, image: imageId });
  if (!deleteResult?.deletedCount) {
    throw new ApiError(500, "Failed to dislike the media");
  }
  //delete notification that user
  await Notification.deleteOne({
    owner_id: existingLike.user,
    username,
    imageId,
    type: "like",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User disliked successfully"));
});

export { NewLike, DeleteLike };
