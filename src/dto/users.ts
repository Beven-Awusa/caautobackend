import { z } from "zod";

// User base schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  isVerified: z.boolean().default(false),
  avatar: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Update Profile DTO
export const UpdateProfileDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

// Update User DTO (Admin)
export const UpdateUserDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).optional(),
  isVerified: z.boolean().optional(),
  avatar: z.string().url().optional(),
});

// User Query DTO
export const UserQueryDto = z.object({
  page: z
    .number()
    .int()
    .min(1, "Page must be at least 1")
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10),
  search: z.string().max(100, "Search term too long").optional(),
  role: z.enum(["user", "admin"]).optional(),
  isVerified: z.boolean().optional(),
  sortBy: z
    .enum(["name", "email", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// User List Response DTO
export const UserListResponseDto = z.object({
  users: z.array(UserSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileDto>;
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
export type UserQueryDto = z.infer<typeof UserQueryDto>;
export type UserListResponse = z.infer<typeof UserListResponseDto>;
