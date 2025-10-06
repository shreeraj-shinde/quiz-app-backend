import { Request, Response } from "express";
import  { findUserById } from "../../lib/users/findUser";
//Controller to get user by id ✅
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: "User id is required" });
    }
    const user = await findUserById(userId);
    if (!user) {    
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user).status(200);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};