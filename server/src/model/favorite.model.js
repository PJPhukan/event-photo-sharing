import mongoose, { Schema } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    image_id: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
      index: true,
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  },
  {
    timestamps: true,
  }
);

FavoriteSchema.index({ user_id: 1, image_id: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);
export { Favorite };
