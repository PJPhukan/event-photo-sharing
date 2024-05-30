import mongoose, { Schema } from "mongoose";
const EventSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

export { Event };
