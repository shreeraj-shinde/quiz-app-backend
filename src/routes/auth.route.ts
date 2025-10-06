import express from "express";
import { authController } from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../validationSchema/authSchema";
import { validate } from "../validationSchema/validate";
const authRouter = express.Router();

// Login route ✅
authRouter.post("/login",validate(loginSchema), authController.login);

// Register route ✅
authRouter.post("/register", validate(registerSchema), authController.register);

export { authRouter as authRoutes };

