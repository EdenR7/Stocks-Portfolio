import { config } from "dotenv";
import connectDB from "./config/db";
import { connection } from "mongoose";

import bcrypt from "bcrypt";
import User from "./models/user.model";
import StockPortfolio from "./models/stockPortfolio.model";
// import Product from "./models/product.model";
// import Cart from "./models/cart.model";

const SALT_ROUNDS = 10;

config();

const users = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    password: "123",
    firstName: "John",
    lastName: "Doe",
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    password: "123",
    firstName: "Jane",
    lastName: "Smith",
  },
  {
    username: "bob_jones",
    email: "bob.jones@example.com",
    password: "123",
    firstName: "Bob",
    lastName: "Jones",
  },
];

async function seedDB() {
  try {
    await connectDB(); // Connect to the database
    await User.deleteMany({});
    await StockPortfolio.deleteMany({});

    const createdUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS); // Hash password
        const user = new User({ ...u, password: hashedPassword }); // Create new user object
        await user.save(); // Save user to database
        return user; // Return the saved user object
      })
    );

    console.log("Database seeded");
  } catch (err) {
    console.error(err);
  } finally {
    connection.close(); // Close the database connection
  }
}

seedDB();
