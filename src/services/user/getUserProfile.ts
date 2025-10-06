import { findUserById } from "../../lib/users/findUser";
import { Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User id is required" });
    }
    const user = await findUserById(userId);

    return res.json(user).status(200);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
