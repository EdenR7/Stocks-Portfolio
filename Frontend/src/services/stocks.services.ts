import api from "./api";

export interface trendingStockI {
  symbol: string;
  change: number;
  value: number;
}

async function getTrendingStocks(): Promise<trendingStockI[]> {
  try {
    const stocks: trendingStockI[] = await api.get("/stocks/trending");
    console.log(stocks);

    return stocks;
  } catch (error) {
    throw error;
  }
}

export const stockService = {
  getTrendingStocks,
};
