import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth.types";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import { getStockData } from "../utils/stocksFuncs";

export async function getUser(req: AuthRequest, res: Response) {
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
}

export async function getUserFavouritesStocks(req: AuthRequest, res: Response) {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favouriteStocks);
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    res.status(500).json({ message: errorMessage });
  }
}

export async function addFavouriteStock(req: AuthRequest, res: Response) {
  const { userId } = req;
  const { symbol } = req.body;

  try {
    // validate the symbol - exist and not dup
    const stock = await getStockData(symbol);

    if (!stock) return res.status(404).json({ message: "Symbol not found" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { favouriteStocks: symbol },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser.favouriteStocks);
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    res.status(500).json({ message: errorMessage });
  }
}

export async function removeFavouriteStock(req: AuthRequest, res: Response) {
  const { userId } = req;
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ message: "Symbol is required" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { favouriteStocks: symbol },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser.favouriteStocks);
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    res.status(500).json({ message: errorMessage });
  }
}

export async function getUsersTransictionHistory(
  req: AuthRequest,
  res: Response
) {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.transictionHistory);
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    res.status(500).json({ message: errorMessage });
  }
}
