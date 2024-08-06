import mongoose, { connect } from "mongoose";
import dotenv, { config } from "dotenv";
import { getErrorMessage } from "../utils/ErrorsFunctions";

config();
async function connectDB() {
  try {
    await connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    const message = getErrorMessage(err);
    console.error(message);
    process.exit(1);
  }
}
export default connectDB;
