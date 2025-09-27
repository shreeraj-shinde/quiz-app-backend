import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({
        message:"Invalid email format"
    }),
    password: z.string().min(6,{
        message:"Password must be at least 6 characters long"
    }),
});

export const registerSchema = z.object({
    email: z.email({
        message:"Invalid email format"
    }),
    password: z.string().min(6,{
        message:"Password must be at least 6 characters long"
    }),
    name: z.string().min(3,{
        message:"Name is required"
    }),
});