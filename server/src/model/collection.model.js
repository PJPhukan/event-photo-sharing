import mongoose from "mongoose";
const collectionSchema = new mongoose.Schema(
  {
    collectionName: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    images: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    /*
    Using aggregation pipeline 
    totalImage:{
        type:Number,
        default:true
    }
    */
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model("Collection", collectionSchema);
export { Collection };
