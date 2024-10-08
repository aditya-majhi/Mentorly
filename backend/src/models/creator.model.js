import mongoose, { Schema } from "mongoose";

const creatorSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coursesCreated: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

export const Creator = mongoose.model("Creator", creatorSchema);
