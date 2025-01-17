import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { type Secret } from "jsonwebtoken";
import { config } from "dotenv";
import { getErrorData } from "../utils/errors/ErrorsFunctions";

config(); // Check that

const { JWT_SECRET } = process.env;

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  try {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("register", errorName, errorMessage);
    if ((error as any).code === 11000) {
      const duplicateField = Object.keys((error as any).keyPattern)[0];
      const message = `The ${duplicateField} is already taken.`;
      console.log(message);
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET as Secret, {
      expiresIn: "5h",
    });

    res.status(200).json(token);
  } catch (error) {
    const { errorMessage, errorName } = getErrorData(error);
    console.log("login", errorName, errorMessage);
    res.status(500).json({ message: "Login failed" });
  }
}
