import mongoose from "mongoose";
const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Image",
    }
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);
export { Image };
