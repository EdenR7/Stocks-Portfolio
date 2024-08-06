import { Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import StockPortfolio, {
  StockPortfolioI,
} from "../models/stockPortfolio.model";
import { recordTransiction } from "../utils/userFuncs";
import { getErrorMessage, getErrorName } from "../utils/ErrorsFunctions";

export async function createPortfolio(req: AuthRequest, res: Response) {
  const { userId } = req;

  const { portfolioName } = req.body;

  try {
    const p = { userId, name: portfolioName };
    const portfolio = new StockPortfolio(p);
    await portfolio.save();

    return res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
}

export async function getUserPortfolios(req: AuthRequest, res: Response) {
  const { userId } = req;
  console.log(userId);

  try {
    const portfolios = await StockPortfolio.find({ userId: userId });
    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
}

export async function getCurrentPortfolioValue(
  req: AuthRequest,
  res: Response
) {
  const { userId } = req;
  const { portfolioId } = req.params;

  try {
    const portfolio: StockPortfolioI | null = await StockPortfolio.findById(
      portfolioId
    );

    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    if (portfolio.userId.toString() !== userId)
      return res.status(403).json({ message: "Forbidden" });

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
}

interface NewStockTransictionI {
  symbol: string;
  quantity: number;
}

export async function addStockToPortfolio(req: AuthRequest, res: Response) {
  const { userId } = req;
  const { portfolioId } = req.params;
  const { newStock } = req.body as { newStock: NewStockTransictionI };

  if (!newStock) return res.status(400).json({ message: "Missing stock" });

  try {
    const portfolio = await StockPortfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const stockIndex = portfolio.stocks.findIndex(
      (stock) => stock.symbol === newStock.symbol
    );
    if (stockIndex !== -1) {
      portfolio.stocks[stockIndex].quantity += newStock.quantity;
    } else {
      portfolio.stocks.push(newStock);
    }
    await recordTransiction(userId!, {
      stockSymbol: newStock.symbol,
      quantity: newStock.quantity,
      type: "Buy",
    });

    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (error) {
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);
    console.log("AddStockToPortfolio error:", errorName, errorMessage);
    if (errorName === "ValidationError") {
      return res.status(400).json({ message: errorMessage });
    }
    res.status(500).json("Internal Server Error");
  }
}

export async function removeStockFromPortfolio( // document in the history
  req: AuthRequest,
  res: Response
) {
  const { userId } = req;
  const { portfolioId } = req.params;
  const { stockTransiction } = req.body as {
    stockTransiction: NewStockTransictionI;
  };
  if (!stockTransiction)
    return res.status(400).json({ message: "Invalid stock data" });

  if (
    !stockTransiction.symbol ||
    typeof stockTransiction.quantity !== "number"
  ) {
    return res.status(400).json({ message: "Invalid stock data" });
  }

  try {
    // match userId
    const portfolio = await StockPortfolio.findOne({
      _id: portfolioId,
      userId,
    });

    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    const stockIndex = portfolio.stocks.findIndex(
      (stock) => stock.symbol === stockTransiction.symbol
    );
    if (stockIndex === -1)
      return res.status(404).json({ message: "Stock not exist" });

    // validate the quantity
    const currentStocksAmount = portfolio.stocks[stockIndex].quantity;
    if (currentStocksAmount < stockTransiction.quantity)
      return res.status(400).json({ message: "Not enough stock" });

    let updatedPortfolio;
    if (currentStocksAmount - stockTransiction.quantity === 0) {
      // remove
      updatedPortfolio = await StockPortfolio.findOneAndUpdate(
        {
          _id: portfolioId,
          "stocks.symbol": stockTransiction.symbol,
        },
        { $pull: { stocks: { symbol: stockTransiction.symbol } } },
        { new: true }
      );
      // portfolio.stocks.splice(stockIndex, 1);
    } else {
      // update
      updatedPortfolio = await StockPortfolio.findOneAndUpdate(
        { _id: portfolioId, "stocks.symbol": stockTransiction.symbol },
        {
          $set: {
            "stocks.$.quantity":
              currentStocksAmount - stockTransiction.quantity,
          },
        },
        { new: true }
      );
      // portfolio.stocks[stockIndex].quantity -= stockTransiction.quantity;
    }

    await recordTransiction(userId!, {
      stockSymbol: stockTransiction.symbol,
      quantity: stockTransiction.quantity,
      type: "Sell",
    });
    // const updatedPortfolio = await portfolio.save();

    res.status(200).json(updatedPortfolio);
  } catch (error) {
    const errorName = getErrorName(error);
    const errorMessage = getErrorMessage(error);
    console.log("removeStockFromPortfolio error:", errorName, errorMessage);
    if (errorName === "ValidationError") {
      return res.status(400).json({ message: errorMessage });
    }
    res.status(500).json("Internal Server Error");
  }
}
