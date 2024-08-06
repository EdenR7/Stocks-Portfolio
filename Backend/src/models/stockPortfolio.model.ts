import mongoose, { Schema } from "mongoose";

export interface PortfolioStockI {
  symbol: string;
  quantity: number;
}

export interface StockPortfolioI {
  _id?: string;
  stocks: PortfolioStockI[];
  name: string;
  userId: Schema.Types.ObjectId;
}

const stockSchema = new mongoose.Schema<PortfolioStockI>(
  {
    symbol: { type: String, required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const portfolioSchema = new mongoose.Schema<StockPortfolioI>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    stocks: [{ type: stockSchema, required: true, default: [] }],
  },
  { timestamps: true }
);

const StockPortfolio = mongoose.model<StockPortfolioI>(
  "Stock Portfolio",
  portfolioSchema
);
export default StockPortfolio;
