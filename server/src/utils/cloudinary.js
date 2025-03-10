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
    console.log("Cloudinary response", cloudinaryResponse);
    fs.unlinkSync(localFilePath);
    return cloudinaryResponse;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return;
  }
};

const cloudinaryDelete = async (publicId) => {
  try {
    if (publicId) {
      const response = await cloudinary.uploader.destroy(publicId);
      return response.json();
    }
  } catch (error) {
    console.error("cloudinary destroy error: ", error);
  }
};

export { cloudinaryUpload, cloudinaryDelete };
