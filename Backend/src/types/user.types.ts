export interface TransictionI {
  stockSymbol: string;
  type: "Buy" | "Sell";
  quantity: number;
}

export interface UserI {
  _id: string;
  password: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  transictionHistory: TransictionI[];
  favouriteStocks: string[];
}

export type UserIWithoutId = Omit<UserI, "_id">;
