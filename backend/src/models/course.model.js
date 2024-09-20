import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    validity: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      ref: "Video",
    },
    courseVideos: {
      type: [{ type: Schema.Types.ObjectId }],
      ref: "Video",
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
