import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
import { userRoutes } from "./routes/user.route";
app.use("/users", userRoutes);

// Routes
app.get("/", (req: Request, res: Response) => {
    const env = process.env.NODE_ENV;
  res.send(`Hello TypeScript + Express + Yarn! ${env}`);
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Start Server
app.listen(PORT, () => {
 
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
