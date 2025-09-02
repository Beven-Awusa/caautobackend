import type { Request, Response } from "express";
import Handler from "express-async-handler";
import * as productService from "../services/products";
import { ResponseHandler } from "../utils/response";
import {
  ProductQueryDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductReviewDto,
} from "../dto/products";
import { ValidationError } from "../utils/errors";
import type { JwtPayload } from "../middleware/auth";

export const getAllProducts = Handler(async (req: Request, res: Response) => {
  // Validate query parameters
  const queryResult = ProductQueryDto.safeParse(req.query);
  if (!queryResult.success) {
    throw new ValidationError("Invalid query parameters");
  }

  const result = await productService.getAllProducts(queryResult.data);
  ResponseHandler.success(res, result, "Products retrieved successfully");
});

export const getProduct = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Product ID is required");
  }

  const product = await productService.getProductById(id);
  ResponseHandler.success(res, product, "Product retrieved successfully");
});

export const createProduct = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = CreateProductDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid product data");
  }

  const user = req.user as JwtPayload;
  const sellerId = user?.id;
  if (!sellerId) {
    throw new ValidationError("User ID is required");
  }

  const product = await productService.createProduct(
    validationResult.data,
    sellerId
  );
  ResponseHandler.created(res, product, "Product created successfully");
});

export const updateProduct = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Product ID is required");
  }

  // Validate request body
  const validationResult = UpdateProductDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid product data");
  }

  const user = req.user as JwtPayload;
  const userId = user?.id;
  const userRole = user?.role;

  if (!userId) {
    throw new ValidationError("User ID is required");
  }

  const product = await productService.updateProduct(
    id,
    validationResult.data,
    userId,
    userRole
  );
  ResponseHandler.updated(res, product, "Product updated successfully");
});

export const deleteProduct = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Product ID is required");
  }

  const user = req.user as JwtPayload;
  const userId = user?.id;
  const userRole = user?.role;

  if (!userId) {
    throw new ValidationError("User ID is required");
  }

  await productService.deleteProduct(id, userId, userRole);
  ResponseHandler.deleted(res, "Product deleted successfully");
});

export const getProductReviews = Handler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError("Product ID is required");
    }

    const productWithReviews = await productService.getProductReviews(id);
    ResponseHandler.success(
      res,
      productWithReviews,
      "Product reviews retrieved successfully"
    );
  }
);

export const createProductReview = Handler(
  async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    if (!productId) {
      throw new ValidationError("Product ID is required");
    }

    // Validate request body
    const validationResult = CreateProductReviewDto.safeParse(req.body);
    if (!validationResult.success) {
      throw new ValidationError("Invalid review data");
    }

    const user = req.user as JwtPayload;
    const userId = user?.id;
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    const review = await productService.createProductReview(
      productId,
      validationResult.data,
      userId
    );
    ResponseHandler.created(res, review, "Review created successfully");
  }
);

export const getProductByCategory = Handler(
  async (req: Request, res: Response) => {
    const { id: categoryId } = req.params;
    if (!categoryId) {
      throw new ValidationError("Category ID is required");
    }

    // Validate query parameters (excluding categoryId since it's from params)
    const queryResult = ProductQueryDto.omit({ categoryId: true }).safeParse(
      req.query
    );
    if (!queryResult.success) {
      throw new ValidationError("Invalid query parameters");
    }

    const result = await productService.getProductsByCategory(
      categoryId,
      queryResult.data
    );
    ResponseHandler.success(
      res,
      result,
      "Products by category retrieved successfully"
    );
  }
);
