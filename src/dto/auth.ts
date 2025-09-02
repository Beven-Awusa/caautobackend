import { z } from "zod";

// Login DTO
export const LoginDto = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register DTO
export const RegisterDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

// Refresh Token DTO
export const RefreshTokenDto = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Forgot Password DTO
export const ForgotPasswordDto = z.object({
  email: z.string().email("Invalid email format"),
});

// Reset Password DTO
export const ResetPasswordDto = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Verify User DTO
export const VerifyUserDto = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Auth Response DTOs
export const AuthResponseDto = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    isVerified: z.boolean(),
  }),
  token: z.string(),
  refreshToken: z.string().optional(),
});

export const RefreshTokenResponseDto = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const VerifyUserResponseDto = z.object({
  message: z.string(),
});

// Type exports
export type LoginDto = z.infer<typeof LoginDto>;
export type RegisterDto = z.infer<typeof RegisterDto>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDto>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;
export type VerifyUserDto = z.infer<typeof VerifyUserDto>;
export type AuthResponse = z.infer<typeof AuthResponseDto>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseDto>;
export type VerifyUserResponse = z.infer<typeof VerifyUserResponseDto>;
