import yahooFinance from "yahoo-finance2";
import { CustomError } from "./errors/CustomError";
import { getErrorData } from "../utils/errors/ErrorsFunctions";
import { Request } from "express";
import { intervalOptions } from "../constants";
import {
  HistoricalHistoryResult,
  HistoricalOptions,
} from "yahoo-finance2/dist/esm/src/modules/historical";
import { HistoricalOptionsIntervalType } from "../types/stocks.types";
import { Quote } from "yahoo-finance2/dist/esm/src/modules/quote";

export async function getStockData(symbol: string): Promise<Quote> {
  try {
    const stock = await yahooFinance.quote(symbol);
    if (!stock) {
      throw new CustomError("NotFoundError", "Symbol not found");
    }
    return stock;
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    console.log("getStockPrice, Error: " + errorName, errorMessage);
    throw new CustomError(errorName, errorMessage);
  }
}

//Historical functions

export async function getHistoricStockData(
  symbol: string,
  queryOptions: HistoricalOptions
): Promise<HistoricalHistoryResult> {
  try {
    const stockHistory = await yahooFinance.historical(symbol, queryOptions);
    return stockHistory;
  } catch (error) {
    const { errorName, errorMessage } = getErrorData(error);
    console.log("getHistoricStockData, Error: " + errorName, errorMessage);
    throw new CustomError(errorName, errorMessage);
  }
}

export function getStocksHistoryQueryOptions(req: Request): HistoricalOptions {
  const { from, to, interval } = req.query;
  if (!from || typeof from !== "string")
    throw new CustomError(
      "CustomError-BadRequest",
      "Missing required query parameter: from"
    );
  try {
    let period1Q: string | Date,
      period2Q: string | Date | undefined,
      intervalQ: HistoricalOptionsIntervalType;
    period1Q = parseDateFromString(from);
    if (to && typeof to === "string") {
      period2Q = parseDateFromString(to) as Date;
    }
    if (interval) {
      if (intervalOptions.includes(interval as HistoricalOptionsIntervalType)) {
        intervalQ = interval as HistoricalOptionsIntervalType;
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

export function parseDateFromString(stringFormat: string | undefined): Date {
  if (typeof stringFormat !== "string") throw new Error("Invalid date format");
  const date = new Date(stringFormat);
  date.setDate(date.getDate() + 1);
  if (stringFormat.length !== 10 || isNaN(date.getTime())) {
    throw new CustomError("CustomError-BadRequest", "Invalid date format");
  }
  return date;
}
