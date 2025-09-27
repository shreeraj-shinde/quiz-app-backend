import express, { Request, Response } from "express";
import prisma from "../prismaClient";
import { getAllUsers, getUserById } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const userRouter = express.Router();

// Get all users ✅
export const userRoutes = userRouter.get("/", authenticate, getAllUsers);

/// Get user by id ✅
export const userByIdRoutes = userRouter.get("/:id", getUserById);