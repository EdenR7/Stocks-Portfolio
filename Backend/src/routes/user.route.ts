import { Router } from "express";
import {
  addFavouriteStock,
  getUser,
  getUserFavouritesStocks,
  getUsersTransictionHistory,
  removeFavouriteStock,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUser);
router.get("/stocks", getUserFavouritesStocks);
router.patch("/stocks", addFavouriteStock);
router.delete("/stocks", removeFavouriteStock);
router.get("/transiction-history", getUsersTransictionHistory);

export default router;
