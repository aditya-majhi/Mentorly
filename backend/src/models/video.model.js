import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", courseSchema);
