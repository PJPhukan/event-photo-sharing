import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View Credentials' below to copy your API secret
});

const cloudinaryUpload = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return cloudinaryResponse;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

const normalizeResourceType = (resourceType = "image") => {
  const allowedTypes = new Set(["image", "video", "raw", "javascript", "css"]);

  if (allowedTypes.has(resourceType)) {
    return resourceType;
  }

  return "image";
};

const cloudinaryDelete = async (publicId, resourceType) => {
  try {
    if (publicId) {
      return await cloudinary.uploader.destroy(publicId, {
        resource_type: normalizeResourceType(resourceType),
      });
    }
  } catch (error) {
    console.error("cloudinary destroy error: ", error);
  }
  return null;
};

export { cloudinaryUpload, cloudinaryDelete };
