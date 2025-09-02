import type { Request, Response } from "express";
import Handler from "express-async-handler";
import * as cartService from "../services/cart";
import { ResponseHandler } from "../utils/response";
import { AddToCartDto, UpdateCartItemDto } from "../dto/cart";
import { ValidationError } from "../utils/errors";
import type { JwtPayload } from "../middleware/auth";

export const getCart = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  const cart = await cartService.getUserCart(user.id);
  ResponseHandler.success(res, cart, "Cart retrieved successfully");
});

export const addToCart = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  // Validate request body
  const validationResult = AddToCartDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid cart item data");
  }

  const { productId, quantity } = validationResult.data;
  const cartItem = await cartService.addToCart(user.id, productId, quantity);

  ResponseHandler.created(res, cartItem, "Item added to cart successfully");
});

export const updateCart = Handler(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  if (!productId) {
    throw new ValidationError("Product ID is required");
  }

  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  // Validate request body
  const validationResult = UpdateCartItemDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid cart item data");
  }

  const { quantity } = validationResult.data;
  const updatedItem = await cartService.updateCartItem(
    user.id,
    productId,
    quantity
  );

  ResponseHandler.success(res, updatedItem, "Cart item updated successfully");
});

export const deleteFromCart = Handler(async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  if (!productId) {
    throw new ValidationError("Product ID is required");
  }

  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  await cartService.removeFromCart(user.id, productId);
  ResponseHandler.success(res, null, "Item removed from cart successfully");
});

export const clearCart = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  await cartService.clearUserCart(user.id);
  ResponseHandler.success(res, null, "Cart cleared successfully");
});
