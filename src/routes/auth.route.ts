import express from "express";
import { loginController, registerController } from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../validationSchema/authSchema";
import { validate } from "../validationSchema/validate";
const authRouter = express.Router();



// Login route ✅
authRouter.post("/login",validate(loginSchema), loginController);

// Register route ✅
authRouter.post("/register", validate(registerSchema), registerController);
