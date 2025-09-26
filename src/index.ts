import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    
  res.send("Hello TypeScript + Express + Yarn!");
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
