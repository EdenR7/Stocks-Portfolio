export interface StockPriceDataI {
  symbol: string;
  type: string;
  curValue: number;
  name: string;
}

export type QueryIntervalOptionsType =
  | "1m"
  | "2m"
  | "5m"
  | "15m"
  | "30m"
  | "60m"
  | "90m"
  | "1h"
  | "1d"
  | "5d"
  | "1wk"
  | "1mo"
  | "3mo"
  | undefined;

export type HistoricalOptionsIntervalType = "1d" | "1wk" | "1mo" | undefined;

export interface HistoricalQueryOptionsI {
  period1: Date;
  period2?: Date | string;
  interval?: QueryIntervalOptionsType;
}
