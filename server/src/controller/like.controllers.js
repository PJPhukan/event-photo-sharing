import { User } from "../model/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../model/likes.model.js";

const NewLike = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { owner, imageId, eventId } = req.body;
  const like = await Like.findOne({ likedUser: _id, image: imageId });
  // console.log(like);
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
  return res.status(200).json(new ApiResponse(200, "User liked successfully"));
});

const DeleteLike = AsyncHandler(async (req, res) => {
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
  return res
    .status(200)
    .json(new ApiResponse(200, "User disliked successfully"));
});

export { NewLike, DeleteLike };
