import mongoose from "mongoose";
import { Favorite } from "../model/favorite.model.js";
import { Image } from "../model/image.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const AddFavorite = AsyncHandler(async (req, res) => {
  const { imageId, eventId } = req.body;

  if (!imageId) {
    throw new ApiError(400, "imageId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new ApiError(400, "Invalid image id");
  }

  if (eventId && !mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  const existingFavorite = await Favorite.findOne({
    user_id: req.user._id,
    image_id: imageId,
  });
  if (existingFavorite) {
    return res
      .status(200)
      .json(new ApiResponse(200, existingFavorite, "Already in favorites"));
  }

  const favorite = await Favorite.create({
    user_id: req.user._id,
    image_id: imageId,
    event_id: eventId || image.event_id || undefined,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, favorite, "Added to favorites"));
});

const RemoveFavorite = AsyncHandler(async (req, res) => {
  const { imageId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new ApiError(400, "Invalid image id");
  }

  const deleteResult = await Favorite.deleteOne({
    user_id: req.user._id,
    image_id: imageId,
  });

  if (!deleteResult?.deletedCount) {
    throw new ApiError(404, "Favorite not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Removed from favorites"));
});

const GetFavorites = AsyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user_id: req.user._id })
    .sort({ createdAt: -1 })
    .populate("image_id")
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, favorites, "Favorites fetched"));
});

export { AddFavorite, RemoveFavorite, GetFavorites };
