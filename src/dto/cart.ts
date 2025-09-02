import { z } from 'zod';

// Cart Item schema
export const CartItemSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too high'),
  price: z.number().positive('Price must be positive'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Add to Cart DTO
export const AddToCartDto = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too high'),
});

// Update Cart Item DTO
export const UpdateCartItemDto = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too high'),
});

// Cart Item with Product Details
export const CartItemWithProductDto = CartItemSchema.extend({
  product: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    images: z.array(z.string().url()),
    brand: z.string(),
    model: z.string(),
    condition: z.enum(['new', 'used', 'refurbished']),
    isAvailable: z.boolean(),
  }),
});

// Cart Response DTO
export const CartResponseDto = z.object({
  items: z.array(CartItemWithProductDto),
  totalItems: z.number().int().min(0),
  totalAmount: z.number().min(0),
  updatedAt: z.date(),
});

// Type exports
export type CartItem = z.infer<typeof CartItemSchema>;
export type AddToCartDto = z.infer<typeof AddToCartDto>;
export type UpdateCartItemDto = z.infer<typeof UpdateCartItemDto>;
export type CartItemWithProduct = z.infer<typeof CartItemWithProductDto>;
export type CartResponse = z.infer<typeof CartResponseDto>;
