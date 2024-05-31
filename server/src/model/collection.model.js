import mongoose from "mongoose";
const collectionSchema = new mongoose.Schema(
  {
    collectionName: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    images: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);
export { Collection };
