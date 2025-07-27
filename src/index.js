import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js"; // Importing the database connection function
dotenv.config({path: "./.env"}); // Load environment variables from .env file
import {app} from "./app.js"; // Importing the Express app

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit the process if the connection fails
})

























/*
const app = express();
app.use(express.json());

;(async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB");
    app.on("error", (err) => {
      console.error("Error in Express app: ", err);
      throw err;
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
*/