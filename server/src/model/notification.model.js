import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    imageId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    username: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export { Notification };
