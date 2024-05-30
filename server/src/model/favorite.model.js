import mongoose, { Schema } from "mongoose";
const FavoriteSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", FavoriteSchema);
export { Favorite };
