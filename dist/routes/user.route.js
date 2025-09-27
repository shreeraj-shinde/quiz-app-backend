"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userByIdRoutes = exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRouter = express_1.default.Router();
// Get all users ✅
exports.userRoutes = userRouter.get("/", auth_middleware_1.authenticate, user_controller_1.getAllUsers);
/// Get user by id ✅
exports.userByIdRoutes = userRouter.get("/:id", user_controller_1.getUserById);
//# sourceMappingURL=user.route.js.map