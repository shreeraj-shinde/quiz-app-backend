import { loginUser } from "../services/auth/login";
import { registerUser } from "../services/auth/register";

// Auth controller ✅
export const authController = {
  login : loginUser,
  register : registerUser,
}






