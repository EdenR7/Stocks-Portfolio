export type StockTransictionI = {
  stockSymbol: string;
  type: "Buy" | "Sell";
  quantity: number;
};

export interface UserI {
  _id: string;
  email: String;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  transictionHistory: StockTransictionI[];
  favouriteStocks: string[]; // Stock Symbol
}

export interface LoginUserDataI {
  username: string;
  password: string;
}

export type RegisterUserDataI = Omit<
  UserI,
  "_id" | "transictionHistory" | "favouriteStocks"
>;
