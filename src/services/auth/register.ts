import { User } from "@prisma/client";
import { Request, Response } from "express";
import { hashPassword } from "../../utils/auth.utils";
import { createUser } from "../../lib/users/createUser";
import { findUserByEmail } from "../../lib/users/findUser";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await findUserByEmail(email); 
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await hashPassword(password);
    const userData = {
        name,
        email,
        password: hashedPassword,
        role,
    } as User

    const user = await createUser(userData);
    res.json({ message: "User registered successfully" }).status(201);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};