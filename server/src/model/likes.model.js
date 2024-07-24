import mongoose, { Schema } from "mongoose";

import MongooseAggregate from "mongoose-aggregate-paginate-v2";
const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    likedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
LikeSchema.plugin(MongooseAggregate);
const Like = new mongoose.model("Like", LikeSchema);
export { Like };
