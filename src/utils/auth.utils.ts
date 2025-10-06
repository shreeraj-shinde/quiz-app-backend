import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
///////////////////////
// Match Passwords ///
/////////////////////
export const matchPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};  


/////////////////////////
// Generate JWT Token //
///////////////////////
export const generateJWT = (userId: string, userRole: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!userId || !userRole) {
    throw new Error("userId and userRole are required");
  }

  return jwt.sign({ userId , role: userRole }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};


export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
}