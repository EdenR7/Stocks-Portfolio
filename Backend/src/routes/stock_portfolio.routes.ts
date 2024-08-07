import { Router } from "express";
import {
  addStockToPortfolio,
  createPortfolio,
  getCurrentPortfolioValue,
  getHistoricalPortfolioData,
  getUserPortfolios,
  removeStockFromPortfolio,
} from "../controllers/stocks_portfolio.controller";

const stockPortfolioRouter = Router();

// Create a new portfolio
stockPortfolioRouter.post("/", createPortfolio);
// Get users portfolios
stockPortfolioRouter.get("/", getUserPortfolios);

// Add a new stock to the portfolio
stockPortfolioRouter.post("/:portfolioId", addStockToPortfolio);
// Remove a stock from the portfolio
stockPortfolioRouter.delete("/:portfolioId", removeStockFromPortfolio);

// Get history stats by params
stockPortfolioRouter.get("/:portfolioId/history", getHistoricalPortfolioData);
// Get current portfolio value
stockPortfolioRouter.get("/:portfolioId", getCurrentPortfolioValue);

export default stockPortfolioRouter;
