import { connect } from "mongoose";
import { config } from "dotenv";
import { getErrorMessage } from "../utils/errors/ErrorsFunctions";

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
