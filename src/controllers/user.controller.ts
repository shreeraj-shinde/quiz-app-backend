import prisma from "../prismaClient";
import { Request, Response } from "express";


//Controller to get all users ✅
export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users).status(200);
    }catch(error){
        res.status(500).json({error:"Internal server error"});
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try{
        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({error:"User id is required"});
        }
        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        });
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        res.json(user).status(200);
    }catch(error){
        res.status(500).json({error:"Internal server error"});
    }
}