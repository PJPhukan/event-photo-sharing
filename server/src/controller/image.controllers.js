import { Event } from "../model/event.model.js";
import { User } from "../model/user.model.js";
import { Image } from "../model/image.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudinaryUpload, cloudinaryDelete } from "../utils/cloudinary.js";
const UploadImage = AsyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { image } = req.files;
  console.log(image);

  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found !");
  const user = await User.findById(event.user_id);
  if (!user) throw new ApiError(404, "User not found !");

  image.forEach(async (img, index) => {
    const localFilePath = req.files[index]?.path;
    if (!localFilePath) {
      throw new ApiError(404, "Error occured while retriving from req files");
      return;
    }
    const cloudinaryResult = cloudinaryUpload(localFilePath);
    if (!cloudinaryResult.url) {
      throw new ApiError(
        500,
        "Error occured while uploading image to cloudinary"
      );
      return;
    }
    const images = await Image.create({
      imageUrl: cloudinaryResult.url,
      title: cloudinaryResult.signature,
      event_id: eventId,
      user_id: req.user._id,
      image_public_id: cloudinaryResult.public_id,
    });
    if (!images) {
      throw new ApiError(500, "Internal server error !!");
    }
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Image uploaded successfully"));
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
