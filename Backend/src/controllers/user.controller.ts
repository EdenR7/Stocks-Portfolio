import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth.types";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

export const getUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...userWithoutPwd } = user.toObject();
    res.json(userWithoutPwd);
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    res.status(500).json({ message: errorMessage });
  }
};
