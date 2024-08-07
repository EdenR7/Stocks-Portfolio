import type { NextFunction, Request, Response } from "express";
import type { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { AuthRequest, UserJwtPaylod } from "../types/auth.types";
import { getErrorMessage } from "../utils/errors/ErrorsFunctions";
const { JWT_SECRET } = process.env;

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    
    const authHeader =
      req.header("Authorization") || req.header("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      console.log(`auth.middleware: no token provided`);
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET as Secret) as UserJwtPaylod;

    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch (error) {
    const message = getErrorMessage(error);
    console.log(`auth.middleware: could not verify token`, message);
    res.status(401).json("Invalid token");
  }
}
