import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prismaClient";
import { Role } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

// Define interface for the JWT payload
interface TokenPayload extends JwtPayload {
  userId: string;
  role: Role;
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Secret key for JWT (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET! ?? "your-secret-key"; // Replace with process.env.JWT_SECRET in production

/**
 * Middleware to authenticate users via JWT token
 * Verifies the token from Authorization header and attaches user to request object
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      (!authHeader.startsWith("Bearer ") && !req.cookies.token)
    ) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role !== Role.USER) {
    return res.status(403).json({ error: "User access required" });
  }

  next();
};
