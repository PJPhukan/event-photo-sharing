import mongoose, { Schema } from "mongoose";

import MongooseAggregate from "mongoose-aggregate-paginate-v2";
const LikeSchema = new Schema(
  {
    user: {//image owner
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
    likedUser: {//who liked the image
      type: Schema.Types.ObjectId,
      ref: "User",
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
LikeSchema.plugin(MongooseAggregate);
const Like = new mongoose.model("Like", LikeSchema);
export { Like };
