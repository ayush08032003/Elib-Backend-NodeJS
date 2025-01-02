import mongoose from "mongoose";
import { config } from "./config";

const databaseUrl: string = config.databaseUrl as string;

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Handles successful connections and errors, logging the appropriate messages.
 * 
 * @returns {Promise<void>} Resolves when the database connection is successfully established.
 * @throws {Error} If the connection fails, the process will exit with a non-zero status code.
 */
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to Database");
    });

    mongoose.connection.on("error", (error) => {
      console.error("db.ts :: Error in Connection to Database : ", error);
    });

    await mongoose.connect(databaseUrl);
  } catch (error) {
    console.error(`db.ts :: Failed to Connect to Database: ${error}`);
    process.exit(1); // if by any chance, the connection not happen, then what is the purpose of having server started..!
  }
};

export default connectDB;
