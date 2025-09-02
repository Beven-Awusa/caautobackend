import type { Request, Response } from "express";
import Handler from "express-async-handler";
import * as authService from "../services/auth";
import { ResponseHandler } from "../utils/response";
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyUserDto,
} from "../dto/auth";
import { ValidationError } from "../utils/errors";
import type { JwtPayload } from "../middleware/auth";

export const login = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = LoginDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid login data");
  }

  const { email, password } = validationResult.data;
  const result = await authService.loginUser(email, password);

  ResponseHandler.success(res, result, "Login successful");
});

export const register = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = RegisterDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid registration data");
  }

  const result = await authService.registerUser(validationResult.data);
  ResponseHandler.created(res, result, "Registration successful");
});

export const logout = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  await authService.logoutUser(user.id);
  ResponseHandler.success(res, null, "Logout successful");
});

export const refresh = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = RefreshTokenDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid refresh token data");
  }

  const { refreshToken } = validationResult.data;
  const result = await authService.refreshToken(refreshToken);

  ResponseHandler.success(res, result, "Token refreshed successfully");
});

export const verify = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = VerifyUserDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid verification data");
  }

  const { token } = validationResult.data;
  const result = await authService.verifyUser(token);

  ResponseHandler.success(res, result, "User verified successfully");
});

export const forgotPassword = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = ForgotPasswordDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid forgot password data");
  }

  const { email } = validationResult.data;
  await authService.forgotPassword(email);

  ResponseHandler.success(res, null, "Password reset email sent");
});

export const resetPassword = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = ResetPasswordDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid reset password data");
  }

  const { token, password } = validationResult.data;
  await authService.resetPassword(token, password);

  ResponseHandler.success(res, null, "Password reset successful");
});
