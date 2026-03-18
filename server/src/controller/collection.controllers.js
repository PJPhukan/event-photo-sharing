import mongoose from "mongoose";
import { Collection } from "../model/collection.model.js";
import { Image } from "../model/image.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";

const CreateCollection = AsyncHandler(async (req, res) => {
  const { name, imageIds } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Collection name is required");
  }

  let coverImage;
  if (req.file?.path) {
    const uploadResult = await cloudinaryUpload(req.file.path);
    if (!uploadResult?.url) {
      throw new ApiError(500, "Error occured while uploading cover image");
    }
    coverImage = uploadResult.url;
  }

  let images = [];
  if (Array.isArray(imageIds) && imageIds.length > 0) {
    const invalidId = imageIds.find(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidId) {
      throw new ApiError(400, "Invalid image id");
    }

    const foundImages = await Image.find({ _id: { $in: imageIds } })
      .select("_id")
      .exec();
    images = foundImages.map((img) => img._id);
  }

  const collection = await Collection.create({
    user_id: req.user._id,
    collectionName: name.trim(),
    coverImage,
    images,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, collection, "Collection created"));
});

const GetCollections = AsyncHandler(async (req, res) => {
  const collections = await Collection.find({ user_id: req.user._id })
    .sort({ createdAt: -1 })
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, collections, "Collections fetched"));
});

const GetCollection = AsyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection id");
  }

  const collection = await Collection.findOne({
    _id: collectionId,
    user_id: req.user._id,
  })
    .populate("images")
    .exec();

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection fetched"));
});

const UpdateCollection = AsyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection id");
  }

  const update = {};
  if (name) {
    if (!name.trim()) {
      throw new ApiError(400, "Collection name is required");
    }
    update.collectionName = name.trim();
  }
  if (req.file?.path) {
    const uploadResult = await cloudinaryUpload(req.file.path);
    if (!uploadResult?.url) {
      throw new ApiError(500, "Error occured while uploading cover image");
    }
    update.coverImage = uploadResult.url;
  }

  const collection = await Collection.findOneAndUpdate(
    { _id: collectionId, user_id: req.user._id },
    { $set: update },
    { new: true }
  );

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection updated"));
});

const AddImageToCollection = AsyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  const { imageId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection id");
  }
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new ApiError(400, "Invalid image id");
  }

  const image = await Image.findById(imageId).select("_id").exec();
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  const collection = await Collection.findOneAndUpdate(
    { _id: collectionId, user_id: req.user._id },
    { $addToSet: { images: imageId } },
    { new: true }
  );

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Image added to collection"));
});

const RemoveImageFromCollection = AsyncHandler(async (req, res) => {
  const { collectionId, imageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection id");
  }
  if (!mongoose.Types.ObjectId.isValid(imageId)) {
    throw new ApiError(400, "Invalid image id");
  }

  const collection = await Collection.findOneAndUpdate(
    { _id: collectionId, user_id: req.user._id },
    { $pull: { images: imageId } },
    { new: true }
  );

  if (!collection) {
    throw new ApiError(404, "Collection not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, collection, "Image removed from collection")
    );
});

const DeleteCollection = AsyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection id");
  }

  const deleteResult = await Collection.deleteOne({
    _id: collectionId,
    user_id: req.user._id,
  });

  if (!deleteResult?.deletedCount) {
    throw new ApiError(404, "Collection not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collection deleted"));
});

export {
  CreateCollection,
  GetCollections,
  GetCollection,
  UpdateCollection,
  AddImageToCollection,
  RemoveImageFromCollection,
  DeleteCollection,
};
