import type { Request, Response } from "express";
import Handler from "express-async-handler";
import * as userService from "../services/users";
import { ResponseHandler } from "../utils/response";
import { UpdateProfileDto, UpdateUserDto, UserQueryDto } from "../dto/users";
import { ValidationError } from "../utils/errors";
import type { JwtPayload } from "../middleware/auth";

export const profile = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  const userProfile = await userService.getUserProfile(user.id);
  ResponseHandler.success(res, userProfile, "Profile retrieved successfully");
});

export const updateProfile = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  // Validate request body
  const validationResult = UpdateProfileDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid profile data");
  }

  const updatedProfile = await userService.updateUserProfile(
    user.id,
    validationResult.data
  );
  ResponseHandler.success(res, updatedProfile, "Profile updated successfully");
});

export const getAllUsers = Handler(async (req: Request, res: Response) => {
  // Validate query parameters
  const queryResult = UserQueryDto.safeParse(req.query);
  if (!queryResult.success) {
    throw new ValidationError("Invalid query parameters");
  }

  const result = await userService.getAllUsers(queryResult.data);
  ResponseHandler.success(res, result, "Users retrieved successfully");
});

export const getUser = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const user = await userService.getUserById(id);
  ResponseHandler.success(res, user, "User retrieved successfully");
});

export const updateUser = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const adminUser = req.user as JwtPayload;
  if (!adminUser?.id) {
    throw new ValidationError("Admin ID is required");
  }

  // Validate request body
  const validationResult = UpdateUserDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid user data");
  }

  const updatedUser = await userService.updateUser(
    id,
    validationResult.data,
    adminUser.id
  );
  ResponseHandler.success(res, updatedUser, "User updated successfully");
});

export const deleteUser = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("User ID is required");
  }

  const adminUser = req.user as JwtPayload;
  if (!adminUser?.id) {
    throw new ValidationError("Admin ID is required");
  }

  await userService.deleteUser(id, adminUser.id);
  ResponseHandler.success(res, null, "User deleted successfully");
});
