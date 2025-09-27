import { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login controller ✅
export const loginController = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Email and password are required"});
        }

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({error:"Invalid password"});
        }
        const token = jwt.sign({userId:user.id}, process.env.JWT_SECRET as string, {expiresIn:"1h"});
        res.json({message:"Login successful", token}).status(200).cookie("token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
        });
    }catch(error){
        res.status(500).json({error:"Internal server error"});
    }
}

// Register controller ✅
export const registerController = async (req: Request, res: Response) => {
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({error:"Email, password and name are required"});
        }
        const existingUser = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(existingUser){
            return res.status(400).json({error:"Email already registered"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                name
            }
        });
        res.json({message:"User registered successfully"}).status(201);
    }catch(error){
        res.status(500).json({error:"Internal server error"});
    }
}
