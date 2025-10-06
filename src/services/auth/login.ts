import { Request, Response } from "express";
import { generateJWT, matchPassword } from "../../utils/auth.utils";
import { findUserByEmail } from "../../lib/users/findUser";
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await matchPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret not found" });
    }
    const token = generateJWT(user.id, user.role);
    
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 3600000, 
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};