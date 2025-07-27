import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // Importing the constant for database name

const connectDB = async () => {
    try {
          const db = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log("Connected to MongoDB",db.connection.host);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
  
}

export default connectDB;