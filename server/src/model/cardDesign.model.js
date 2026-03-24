import mongoose, { Schema } from "mongoose";

const CardDesignSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    elements: {
      type: Schema.Types.Mixed,
      default: {},
    },
    background: {
      type: Schema.Types.Mixed,
      default: null,
    },
    backgroundImage: {
      type: String,
      default: null,
    },
    canvasSize: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    templateId: {
      type: String,
      default: "clean-light",
    },
    name: {
      type: String,
      default: "Untitled",
      trim: true,
    },
  },
  { timestamps: true }
);

const CardDesign = mongoose.model("CardDesign", CardDesignSchema);

export { CardDesign };
