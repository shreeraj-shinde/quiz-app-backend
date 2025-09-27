"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
//Controller to get all users ✅
const getAllUsers = async (req, res) => {
    try {
        const users = await prismaClient_1.default.user.findMany();
        res.json(users).status(200);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: "User id is required" });
        }
        const user = await prismaClient_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user).status(200);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUserById = getUserById;
//# sourceMappingURL=user.controller.js.map