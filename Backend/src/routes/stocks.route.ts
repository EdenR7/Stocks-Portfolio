import { Router } from "express";
import {
  getCurrentStockPrice,
  getStockHistoricalPrices,
  getSymbolByName,
} from "../controllers/stocks.controller";

const stocksRouter = Router();

stocksRouter.get("/symbol/:name", getSymbolByName);
stocksRouter.get("/historical/:symbol", getStockHistoricalPrices);
stocksRouter.get("/:symbol", getCurrentStockPrice);

export default stocksRouter;
