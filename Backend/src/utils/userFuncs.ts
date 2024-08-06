import User from "../models/user.model";
import { TransictionI } from "../types/user.types";
import { CustomError } from "./CustomError";

export async function recordTransiction(
  userId: string,
  transiction: TransictionI
) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { transictionHistory: transiction } },
      { runValidators: true, new: true }
    );
    if (!updatedUser) {
      throw new CustomError("NotFound", "User not found");
    }
  } catch (error) {
    throw error;
  }
}
