import type { Request, Response } from "express";
import Handler from "express-async-handler";
import * as orderService from "../services/orders";
import { ResponseHandler } from "../utils/response";
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from "../dto/orders";
import { ValidationError } from "../utils/errors";
import type { JwtPayload } from "../middleware/auth";

export const getAllOrders = Handler(async (req: Request, res: Response) => {
  // Validate query parameters
  const queryResult = OrderQueryDto.safeParse(req.query);
  if (!queryResult.success) {
    throw new ValidationError("Invalid query parameters");
  }

  const result = await orderService.getAllOrders(queryResult.data);
  ResponseHandler.success(res, result, "Orders retrieved successfully");
});

export const getOrder = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Order ID is required");
  }

  const user = req.user as JwtPayload;
  const order = await orderService.getOrderById(id, user?.id);
  ResponseHandler.success(res, order, "Order retrieved successfully");
});

export const createOrder = Handler(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  // Validate request body
  const validationResult = CreateOrderDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid order data");
  }

  const order = await orderService.createOrder(user.id, validationResult.data);
  ResponseHandler.created(res, order, "Order created successfully");
});

export const updateOrder = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Order ID is required");
  }

  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  // Validate request body
  const validationResult = UpdateOrderDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid order data");
  }

  const updatedOrder = await orderService.updateOrder(
    id,
    validationResult.data,
    user.id,
    user.role
  );
  ResponseHandler.success(res, updatedOrder, "Order updated successfully");
});

export const confirmOrder = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Order ID is required");
  }

  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  const confirmedOrder = await orderService.confirmOrder(id, user.id);
  ResponseHandler.success(res, confirmedOrder, "Order confirmed successfully");
});

export const orderByUserId = Handler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const currentUser = req.user as JwtPayload;

  // Users can only view their own orders unless they're admin
  const targetUserId = userId || currentUser?.id;
  if (!targetUserId) {
    throw new ValidationError("User ID is required");
  }

  if (currentUser?.id !== targetUserId && currentUser?.role !== "admin") {
    throw new ValidationError("Access denied");
  }

  // Validate query parameters
  const queryResult = OrderQueryDto.safeParse(req.query);
  if (!queryResult.success) {
    throw new ValidationError("Invalid query parameters");
  }

  const result = await orderService.getOrdersByUserId(
    targetUserId,
    queryResult.data
  );
  ResponseHandler.success(res, result, "User orders retrieved successfully");
});

export const cancelOrder = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Order ID is required");
  }

  const user = req.user as JwtPayload;
  if (!user?.id) {
    throw new ValidationError("User ID is required");
  }

  const cancelledOrder = await orderService.cancelOrder(id, user.id);
  ResponseHandler.success(res, cancelledOrder, "Order cancelled successfully");
});

export const deleteOrder = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Order ID is required");
  }

  const user = req.user as JwtPayload;
  if (!user?.id || user.role !== "admin") {
    throw new ValidationError("Admin access required");
  }

  await orderService.deleteOrder(id, user.id);
  ResponseHandler.success(res, null, "Order deleted successfully");
});
