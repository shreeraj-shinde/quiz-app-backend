"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authSchema_1 = require("../validationSchema/authSchema");
const validate_1 = require("../validationSchema/validate");
const authRouter = express_1.default.Router();
// Login route ✅
authRouter.post("/login", (0, validate_1.validate)(authSchema_1.loginSchema), auth_controller_1.loginController);
// Register route ✅
authRouter.post("/register", (0, validate_1.validate)(authSchema_1.registerSchema), auth_controller_1.registerController);
//# sourceMappingURL=auth.route.js.map