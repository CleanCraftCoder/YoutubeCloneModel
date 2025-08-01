
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory


//routes import
import userRouter from "./routes/user.routes.js";


//routes declaration
app.use("/api/v1/users",userRouter)
//https://localhost:3000/api/v1/users/jobhi ho uske baad run karenge
export {app}