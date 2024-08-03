import { Event } from "../model/event.model.js";
import { User } from "../model/user.model.js";
import { Image } from "../model/image.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudinaryUpload, cloudinaryDelete } from "../utils/cloudinary.js";
const UploadImage = AsyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    throw new ApiError(400, "No such file found");
  }

  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found !");
  const user = await User.findById(event.user_id);
  if (!user) throw new ApiError(404, "User not found !");

  const uploadPromises = files.map(async (img, index) => {
    const localFilePath = req.files[index]?.path;
    if (!localFilePath) {
      throw new ApiError(404, "Error occurred while retrieving from req files");
    }
    const cloudinaryResult = await cloudinaryUpload(localFilePath);

    if (!cloudinaryResult) {
      throw new ApiError(
        500,
        "Error occurred while uploading image to cloudinary"
      );
    }

    const image = await Image.create({
      imageUrl: cloudinaryResult.url,
      title: cloudinaryResult.signature,
      event_id: eventId,
      user_id: req.user._id,
      image_public_id: cloudinaryResult.public_id,
      resource_type: cloudinaryResult.resource_type,
    });

    if (!image) {
      throw new ApiError(500, "Internal server error !!");
    }
    return image;
  });

  const uploadedImages = await Promise.all(uploadPromises);
  if (uploadedImages) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, uploadedImages, "Images uploaded successfully")
      );
  }
});

const DeleteImage = AsyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const image = await Image.findById(imageId);
  if (!image) throw new ApiError(404, "Image not found !");
  const user = await User.findById(image.user_id);
  if (!user) throw new ApiError(404, "User not found !");

  const deletedImage = await cloudinaryDelete(image.image_public_id);
  if (!deletedImage.result) {
    throw new ApiError(
      500,
      "Error occured while deleting image from cloudinary"
    );
  }
  const result = await User.findByIdAndDelete(imageId);
  if (result) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Image deleted successfully"));
  }
});

const GetImage = AsyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const image = await Image.findById(imageId);
  if (!image) throw new ApiError(404, "Image not found");
  return res
    .status(200)
    .json(new ApiResponse(200, { image }, "Image fetched successfully"));
});
export { UploadImage, DeleteImage, GetImage };
