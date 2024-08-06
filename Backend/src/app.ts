import express, { Application } from "express";
import userRoutes from "./routes/user.route";
import stocksRouter from "./routes/stocks.route";
import authRouter from "./routes/auth.routes";
import connectDB from "./config/db";
import cors from "cors";
import { verifyToken } from "./middleware/auth.middleware";
import stockPortfolioRouter from "./routes/stock_portfolio.routes";

const app: Application = express();

export async function main() {
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );
  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/stocks", stocksRouter);
  app.use("/api/portfolio", verifyToken, stockPortfolioRouter);
  app.use("/api/users", verifyToken, userRoutes);
}
export default app;

// portfolio history value
// portfolio validations
// add user favourites crud
// clean, orgnize and make the code readable and more precise
