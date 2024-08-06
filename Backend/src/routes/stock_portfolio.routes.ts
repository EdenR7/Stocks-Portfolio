import { Router } from "express";
import {
  addStockToPortfolio,
  createPortfolio,
  getCurrentPortfolioValue,
  getUserPortfolios,
  removeStockFromPortfolio,
} from "../controllers/stocks_portfolio.controller";

const stockPortfolioRouter = Router();

// Create a new portfolio
stockPortfolioRouter.post("/", createPortfolio);
stockPortfolioRouter.get("/", getUserPortfolios);

// Add a new stock to the portfolio
stockPortfolioRouter.post("/:portfolioId", addStockToPortfolio);
// Remove a stock from the portfolio
stockPortfolioRouter.delete("/:portfolioId", removeStockFromPortfolio);
// Get current portfolio value
stockPortfolioRouter.get("/:portfolioId", getCurrentPortfolioValue);

// Get history stats by params

export default stockPortfolioRouter;
