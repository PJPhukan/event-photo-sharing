import mongoose,{Schema} from "mongoose";
const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Image",
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image_public_id: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      default: "public",
    },
    resource_type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);
export { Image };
