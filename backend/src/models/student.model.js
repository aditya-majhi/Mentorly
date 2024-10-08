import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  learner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coursesTaken: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

export const Student = mongoose.model("Student", studentSchema);
