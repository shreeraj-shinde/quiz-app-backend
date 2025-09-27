"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = exports.loginController = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Login controller ✅
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await prismaClient_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token }).status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.loginController = loginController;
// Register controller ✅
const registerController = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Email, password and name are required" });
        }
        const existingUser = await prismaClient_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prismaClient_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        res.json({ message: "User registered successfully" }).status(201);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.registerController = registerController;
//# sourceMappingURL=auth.controller.js.map