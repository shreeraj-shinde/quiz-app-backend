import express, { Request, Response } from "express";
import { userRoutes } from "./routes/user.route";
import { authRoutes } from "./routes/auth.route";


const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Routes
app.get("/", (req: Request, res: Response) => {
    
  res.send(`Hello TypeScript + Express + Yarn!`);
});


// Start Server
app.listen(PORT, () => {
 
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
