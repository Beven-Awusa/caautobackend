import { z } from "zod";

// Order Item schema
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
  productName: z.string(),
  productImage: z.string().url().optional(),
});

// Order schema
export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(OrderItemSchema),
  totalAmount: z.number().positive(),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  billingAddress: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zipCode: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
    })
    .optional(),
  notes: z.string().max(500, "Notes too long").optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create Order DTO
export const CreateOrderDto = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid product ID"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
    })
  ),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  billingAddress: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zipCode: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
    })
    .optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

// Update Order DTO
export const UpdateOrderDto = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

// Order Query DTO
export const OrderQueryDto = z.object({
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
  status: z
    .enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  userId: z.string().uuid().optional(),
  sortBy: z
    .enum(["createdAt", "totalAmount", "status"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Order List Response DTO
export const OrderListResponseDto = z.object({
  orders: z.array(OrderSchema),
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
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderDto = z.infer<typeof CreateOrderDto>;
export type UpdateOrderDto = z.infer<typeof UpdateOrderDto>;
export type OrderQueryDto = z.infer<typeof OrderQueryDto>;
export type OrderListResponse = z.infer<typeof OrderListResponseDto>;
