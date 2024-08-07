import e, { Request, Response } from "express";
import yahooFinance from "yahoo-finance2";
import { HistoricalOptions } from "yahoo-finance2/dist/esm/src/modules/historical";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

import { CustomError } from "../utils/errors/CustomError";
import {
  getStockData,
  getStocksHistoryQueryOptions,
} from "../utils/stocksFuncs";

export async function getCurrentStockPrice(req: Request, res: Response) {
  const { symbol } = req.params;

  try {
    const stock = await getStockData(symbol);
    if (!stock) {
      return res.status(404).json({ message: "Symbol not found" });
    }
    res.status(200).json({
      value: stock.regularMarketPrice,
      name: stock.shortName,
      type: stock.quoteType,
      symbol: stock.symbol,
    });
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("getCurrentStockPrice, Error: " + errorName, errorMessage);
    if (errorName === "NotFoundError")
      return res.status(404).json({ message: errorMessage });
    res.status(500).json("Internal Server Error");
  }
}

function symbolsFilter(req: Request) {
  const { type } = req.query;
  if (type === "equity") {
    return (quote: any) => quote.typeDisp?.toUpperCase() === "EQUITY";
  } else if (type === "etf") {
    return (quote: any) => quote.typeDisp?.toUpperCase() === "ETF";
  } else {
    return (quote: any) =>
      quote.typeDisp?.toUpperCase() === "EQUITY" ||
      quote.typeDisp?.toUpperCase() === "ETF";
  }
}

export async function getSymbolByName(req: Request, res: Response) {
  const { name } = req.params;

  try {
    const symbols = await yahooFinance.search(name);
    if (!symbols.quotes.length) {
      return res.status(404).json({ message: "Symbol not found" });
    }

    const filteredSymbols = symbols.quotes.filter(symbolsFilter(req));

    res.status(200).json(filteredSymbols);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("getSymbolByName, Error: " + errorName, errorMessage);

    res.status(500).json("Internal Server Error");
  }
}

export async function getStockHistoricalPrices(req: Request, res: Response) {
  const { symbol } = req.params;

  try {
    const queryOptions = getStocksHistoryQueryOptions(req);
    const stockHistory = await yahooFinance.historical(
      symbol,
      queryOptions as HistoricalOptions
    );

    res.status(200).json(stockHistory);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("getStockHistoricalPrices, Error: " + errorName, errorMessage);
    if (errorName === "CustomError-BadRequest") {
      return res.status(400).json({ message: errorMessage });
    }
    if (errorName === "HTTPError") {
      return res.status(404).json({ message: errorMessage });
    }
    res.status(500).json("Internal Server Error");
  }
}

// concat promises
// const fields = ["regularMarketPrice", "shortName", "quoteType", "symbol"];
// const stockDataPromises = stocksTry.map(async (symbol) => {
//   const stock = await yahooFinance.quoteCombine(symbol, { fields });
//   return {
//     name: stock?.shortName,
//     value: stock?.regularMarketPrice,
//     type: stock?.quoteType,
//     symbol: stock?.symbol,
//   };
// });
// const stocks = await Promise.all(stockDataPromises);
// console.timeEnd("Get current stock price");
// res.status(200).json(stocks);
