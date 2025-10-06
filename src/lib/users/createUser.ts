import { User } from "@prisma/client";
import prisma from "../../prismaClient";



export const createUser = async (userData: User) => {
  try {
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  } catch (error) {
    return null;
  }
}
