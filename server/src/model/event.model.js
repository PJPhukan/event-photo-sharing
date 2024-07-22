import mongoose, { Schema } from "mongoose";
import { image } from "../data/eventImage";
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
    },
    ContactDetails: {
      type: Number,
      required: true,
    },
    CoverImage: {
      type: String,
      default: function () {
        const url = image.some((n) => {
          n.type.toLowerCase().includes(this.EventType.toLowerCase());
        });
        return url;
      },
    },
  },

  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

export { Event };
