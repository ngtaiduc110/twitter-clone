import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});
