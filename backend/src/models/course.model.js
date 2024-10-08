import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    validity: {
      type: Date,
      required: true,
    },
    progress: {
      type: Number,
      ref: "Video",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    courseVideos: [
      {
        className: {
          type: String,
          required: true,
        },
        videos: [
          {
            type: Schema.Types.ObjectId,
            ref: "Video",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
