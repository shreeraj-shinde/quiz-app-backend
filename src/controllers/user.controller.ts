import { getAllUsers as getAllUsersService } from "../lib/users/getAllUsers";
import { getUserById as getUserByIdService } from "../services/user/getUserById";
import { getUserProfile as getUserProfileService } from "../services/user/getUserProfile";

export const userController = {
  getAllUsers : getAllUsersService,
  getUserById : getUserByIdService,
  getUserProfile : getUserProfileService,
}

