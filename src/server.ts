import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import Routes
import userRoutes from "./user/v1/user.routes";
import bookRoutes from "./book/v1/book.routes";
import reservationRoutes from "./reservation/v1/reservation.routes";

// Initialize App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API prefix
const SERVER_VERSION = "/api/v1";

// Mongo
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use(`${SERVER_VERSION}/users`, userRoutes);
app.use(`${SERVER_VERSION}/books`, bookRoutes);
app.use(`${SERVER_VERSION}/reservation`, reservationRoutes);

// Route not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found.",
  });
});

// Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", error);
  res.status(500).json({
    error: "Internal server error.",
    details: error.message,
  });
});

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
