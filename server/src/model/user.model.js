import mongoose, { Schema } from "mongoose";
import { names } from "../data/names.js";
const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      max:10,
    },
    avatar: {
      type: String,
      default: function () {
        const isFamale = names.some(
          (n) =>
            n.name.toLowercase().includes(this.fullname.toLowercase()) &&
            n.gender === "female"
        );
        const gender = isFamale ? "female" : "male";
        return `https://d2u8k2ocievbld.cloudfront.net/memojis/${gender}/${
          Math.floor(Math.random() * 30) + 1
        }.png`;
      },
    },
    coverImage: {
      type: String,
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export { User };
