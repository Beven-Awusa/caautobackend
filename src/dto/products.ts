import { z } from "zod";

// Base product schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description too long"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().uuid("Invalid category ID"),
  brand: z.string().min(1, "Brand is required").max(100, "Brand name too long"),
  model: z.string().min(1, "Model is required").max(100, "Model name too long"),
  year: z
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  condition: z.enum(["new", "used", "refurbished"], {
    errorMap: () => ({
      message: "Condition must be new, used, or refurbished",
    }),
  }),
  mileage: z.number().int().min(0, "Mileage cannot be negative").optional(),
  fuelType: z
    .enum(["gasoline", "diesel", "electric", "hybrid"], {
      errorMap: () => ({ message: "Invalid fuel type" }),
    })
    .optional(),
  transmission: z
    .enum(["manual", "automatic", "cvt"], {
      errorMap: () => ({ message: "Invalid transmission type" }),
    })
    .optional(),
  color: z.string().min(1, "Color is required").max(50, "Color name too long"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(10, "Maximum 10 images allowed"),
  features: z
    .array(z.string().min(1, "Feature cannot be empty"))
    .max(20, "Maximum 20 features allowed"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location too long"),
  sellerId: z.string().uuid("Invalid seller ID"),
  status: z.enum(["active", "sold", "inactive"], {
    errorMap: () => ({ message: "Status must be active, sold, or inactive" }),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create product DTO
export const CreateProductDto = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
}).extend({
  sellerId: z.string().uuid("Invalid seller ID").optional(), // Will be set from auth
});

// Update product DTO
export const UpdateProductDto = CreateProductDto.partial();

// Product query/filter DTO
export const ProductQueryDto = z.object({
  page: z
    .number()
    .int()
    .positive("Page must be positive")
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .positive("Limit must be positive")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10),
  status: z.enum(["active", "sold", "inactive"]).optional(),
  search: z.string().max(100, "Search term too long").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  brand: z.string().max(100, "Brand filter too long").optional(),
  minPrice: z.number().min(0, "Price cannot be negative").optional(),
  maxPrice: z.number().min(0, "Price cannot be negative").optional(),
  condition: z.enum(["new", "used", "refurbished"]).optional(),
  fuelType: z.enum(["gasoline", "diesel", "electric", "hybrid"]).optional(),
  transmission: z.enum(["manual", "automatic", "cvt"]).optional(),
  minYear: z
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year")
    .optional(),
  maxYear: z
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year")
    .optional(),
  location: z.string().max(200, "Location filter too long").optional(),
  sortBy: z
    .enum(["price", "year", "mileage", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Product review schema
export const ProductReviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid("Invalid product ID"),
  userId: z.string().uuid("Invalid user ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment too long"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create product review DTO
export const CreateProductReviewDto = ProductReviewSchema.omit({
  id: true,
  productId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Update product review DTO
export const UpdateProductReviewDto = CreateProductReviewDto.partial();

// Product with reviews DTO
export const ProductWithReviewsDto = ProductSchema.extend({
  reviews: z.array(ProductReviewSchema),
  averageRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
});

// Product list response DTO
export const ProductListResponseDto = z.object({
  products: z.array(ProductSchema),
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
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductDto = z.infer<typeof CreateProductDto>;
export type UpdateProductDto = z.infer<typeof UpdateProductDto>;
export type ProductQueryDto = z.infer<typeof ProductQueryDto>;
export type ProductReview = z.infer<typeof ProductReviewSchema>;
export type CreateProductReviewDto = z.infer<typeof CreateProductReviewDto>;
export type UpdateProductReviewDto = z.infer<typeof UpdateProductReviewDto>;
export type ProductWithReviews = z.infer<typeof ProductWithReviewsDto>;
export type ProductListResponse = z.infer<typeof ProductListResponseDto>;
