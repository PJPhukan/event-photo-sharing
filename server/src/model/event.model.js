import mongoose, { Schema } from "mongoose";
import { image } from "../data/eventImage.js";
const isInclude = (n) => {
  return n.type.toLowerCase().includes(this.EventType.toLowerCase());
};
const EventSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    EventName: {
      type: String,
      required: true,
    },
    EventDescription: {
      type: String,
      required: true,
    },
    EventDate: {
      type: Date,
      required: true,
    },
    EventLocation: {
      type: String,
      required: true,
    },
    EventType: {
      type: String,
      required: true,
      enum: [
        "Wedding",
        "Convocation",
        "Marathon",
        "School",
        "College",
        "Social Club",
        "Corporate Event",
      ],
    },
    ContactDetails: {
      type: Number,
      required: true,
    },
    CoverImage: {
      type: String,
      default: function () {
        const url = image.filter(isInclude);
        return url.url;
      },
    },
  },

  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

export { Event };
