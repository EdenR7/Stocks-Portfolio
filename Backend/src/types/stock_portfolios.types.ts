import { Schema } from "mongoose";

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

export interface NewStockTransictionI {
  symbol: string;
  quantity: number;
}
