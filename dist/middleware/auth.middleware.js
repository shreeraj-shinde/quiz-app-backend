"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const client_1 = require("@prisma/client");
// Secret key for JWT (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key'; // Replace with process.env.JWT_SECRET in production
/**
 * Middleware to authenticate users via JWT token
 * Verifies the token from Authorization header and attaches user to request object
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Find user in database
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role !== client_1.Role.ADMIN) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.middleware.js.map