import { Request, Response } from "express";
import yahooFinance from "yahoo-finance2";
import { intervalOptions, stocksTry } from "../constants";
import { HistoricalOptions } from "yahoo-finance2/dist/esm/src/modules/historical";
import { getErrorMessage, getErrorName } from "../utils/ErrorsFunctions";
import { CustomError } from "../utils/CustomError";

export async function getCurrentStockPrice(req: Request, res: Response) {
  const { symbol } = req.params;

  try {
    const stock = await yahooFinance.quote(symbol);
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
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);
    console.log("getCurrentStockPrice, Error: " + errorName, errorMessage);
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
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);
    console.log("getSymbolByName, Error: " + errorName, errorMessage);

    res.status(500).json("Internal Server Error");
  }
}

export async function getStockHistoricalPrices(req: Request, res: Response) {
  const { symbol } = req.params;

  try {
    const queryOptions = getStocksHistoryQueryOptions(req);
    console.log(queryOptions);
    const stockHistory = await yahooFinance.historical(
      symbol,
      queryOptions as HistoricalOptions
    );
    res.status(200).json(stockHistory);
  } catch (error: any) {
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);
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
function getStocksHistoryQueryOptions(req: Request) {
  const { from, to, interval } = req.query;
  if (!from || typeof from !== "string")
    throw new CustomError(
      "CustomError-BadRequest",
      "Missing required query parameter: from"
    );
  try {
    let period1Q: string | Date, period2Q: string | Date | undefined, intervalQ;
    period1Q = parseDateFromString(from);
    if (to && typeof to === "string") {
      period2Q = parseDateFromString(to) as Date;
    }
    if (interval) {
      if (intervalOptions.includes(interval as string)) {
        intervalQ = interval;
      } else {
        throw new CustomError(
          "CustomError-BadRequest",
          "Invalid interval query"
        );
      }
    }
    return {
      period1: period1Q,
      period2: period2Q ? period2Q : "",
      interval: intervalQ || "1d",
    };
  } catch (error) {
    throw error;
  }
}
function parseDateFromString(stringFormat: string | undefined) {
  if (typeof stringFormat !== "string") throw new Error("Invalid date format");
  const date = new Date(stringFormat);
  date.setDate(date.getDate() + 1);
  if (stringFormat.length !== 10 || isNaN(date.getTime())) {
    throw new CustomError("CustomError-BadRequest", "Invalid date format");
  }
  return date;
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
