import mongoose, { model, Schema } from "mongoose";
import type { TransictionI, UserI } from "../types/user.types.js";

const transictionSchema = new mongoose.Schema<TransictionI>(
  {
    stockSymbol: { type: String, required: true },
    type: { type: String, enum: ["Buy", "Sell"], required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema<UserI>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    transictionHistory: [{ type: transictionSchema, default: [] }],
    favouriteStocks: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
