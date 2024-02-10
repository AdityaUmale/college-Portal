import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

async function connectDB() {
  if (!DATABASE_URL) {
    throw new Error(
      "Please define the DATABASE_URL environment variable inside .env.local"
    );
  }
  mongoose
    .connect(DATABASE_URL)
    .then(() => {
      console.log("Database Connection Succesfull");
    })
    .catch((err) => {
      console.log("Error connecting to db", err);
    });
}

export default connectDB;
