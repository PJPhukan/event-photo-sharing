import mongoose from "mongoose";
const collectionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collectionName: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    images: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Image",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);
export { Collection };
