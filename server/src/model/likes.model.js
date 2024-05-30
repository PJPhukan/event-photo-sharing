import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

const Like = new mongoose.model("Like", LikeSchema);
export { Like };
