import express, { Request, Response } from "express";
import { userRoutes } from "./routes/user.route";
import { authRoutes } from "./routes/auth.route";
import { quizRoutes } from "./routes/quiz.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import setupSwagger from "./swagger";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Swagger documentation
setupSwagger(app);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
