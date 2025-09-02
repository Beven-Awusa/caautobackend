import { z } from "zod";

// Category base schema
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name too long"),
  description: z.string().max(500, "Description too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create Category DTO
export const CreateCategoryDto = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update Category DTO
export const UpdateCategoryDto = CreateCategoryDto.partial();

// Category Query DTO
export const CategoryQueryDto = z.object({
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
  isActive: z.boolean().optional(),
  sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Category with Product Count DTO
export const CategoryWithProductCountDto = CategorySchema.extend({
  productCount: z.number().int().min(0),
});

// Category List Response DTO
export const CategoryListResponseDto = z.object({
  categories: z.array(CategoryWithProductCountDto),
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
export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryDto = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDto>;
export type CategoryQueryDto = z.infer<typeof CategoryQueryDto>;
export type CategoryWithProductCount = z.infer<
  typeof CategoryWithProductCountDto
>;
export type CategoryListResponse = z.infer<typeof CategoryListResponseDto>;
