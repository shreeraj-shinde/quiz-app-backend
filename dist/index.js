"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = 5000;
// Middleware
app.use(express_1.default.json());
const user_route_1 = require("./routes/user.route");
app.use("/users", user_route_1.userRoutes);
// Routes
app.get("/", (req, res) => {
    const env = process.env.NODE_ENV;
    res.send(`Hello TypeScript + Express + Yarn! ${env}`);
});
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});
// Start Server
app.listen(PORT, () => {
    const env = process.env.NODE_ENV ?? "development";
    console.log(`🚀 Server running at http://localhost:${PORT} in ${env} mode`);
});
//# sourceMappingURL=index.js.map