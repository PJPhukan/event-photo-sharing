import { User } from "../model/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../model/likes.model.js";

const NewLike = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { likeuser, imageId } = req.body;
  const like = await Like.findOne({ likedUser: likeuser, user: _id });
  if (like) {
    throw new ApiError(400, "You already liked this user");
  }
  const newLike = await Like.create({
    likedUser: likeuser,
    user: _id,
    image: imageId,
  });
  if (!newLike) {
    throw new ApiError(500, "Failed to create like");
  }
  return res.status(200).json(new ApiResponse(200, "User liked successfully"));
});

const DeleteLike = AsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { likeuser, imageId } = req.body;
  let like = await Like.findOne({ likedUser: likeuser, user: _id });
  if (!like) {
    throw new ApiError(400, "You did not liked yete");
  }
  like = await Like.deleteOne({ likedUser: likeuser, user: _id });
  if (!like) {
    throw new ApiError(500, "Failed to delete like");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User Unliked successfully"));
});


export { NewLike, DeleteLike };
