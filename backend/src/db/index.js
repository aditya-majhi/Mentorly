import mongoose from "mongoose";
import crypto from "crypto";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    var token = crypto.randomBytes(32).toString("hex");
    console.log({ connection, token });
  } catch (error) {
    console.error({ error });
    throw error;
  }
};

export default connectDB;
