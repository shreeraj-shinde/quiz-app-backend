import express from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const userRouter = express.Router();

// Get all users ✅
userRouter.get("/", authenticate, userController.getAllUsers);

// Get user profile ✅
userRouter.get("/profile", authenticate, userController.getUserProfile);

// Get user by id ✅
userRouter.get("/:id", authenticate, userController.getUserById);

export { userRouter as userRoutes };
