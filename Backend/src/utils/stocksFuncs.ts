import yahooFinance from "yahoo-finance2";
import { CustomError } from "./CustomError";
import { getErrorMessages, getErrorName } from "./ErrorsFunctions";

export async function getStockPrice(symbol: string) {
  try {
    const stock = await yahooFinance.quote(symbol);
    if (!stock) {
      throw new CustomError("NotFoundError", "Symbol not found");
    }
    return {
      value: stock.regularMarketPrice,
      name: stock.shortName,
      type: stock.quoteType,
      symbol: stock.symbol,
    };
  } catch (error) {
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessages(error);
    console.log("getStockPrice, Error: " + errorName, errorMessage);
    throw new CustomError(errorName, errorMessage);
  }
}
