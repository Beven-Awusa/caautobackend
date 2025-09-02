import type { Request, Response } from "express";
import Handler from "express-async-handler";
import * as categoryService from "../services/categories";
import { ResponseHandler } from "../utils/response";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
} from "../dto/categories";
import { ProductQueryDto } from "../dto/products";
import { ValidationError } from "../utils/errors";

export const getAllCategories = Handler(async (req: Request, res: Response) => {
  // Validate query parameters
  const queryResult = CategoryQueryDto.safeParse(req.query);
  if (!queryResult.success) {
    throw new ValidationError("Invalid query parameters");
  }

  const result = await categoryService.getAllCategories(queryResult.data);
  ResponseHandler.success(res, result, "Categories retrieved successfully");
});

export const getCategoryProducts = Handler(
  async (req: Request, res: Response) => {
    const { id: categoryId } = req.params;
    if (!categoryId) {
      throw new ValidationError("Category ID is required");
    }

    // Validate query parameters
    const queryResult = ProductQueryDto.omit({ categoryId: true }).safeParse(
      req.query
    );
    if (!queryResult.success) {
      throw new ValidationError("Invalid query parameters");
    }

    const result = await categoryService.getCategoryProducts(
      categoryId,
      queryResult.data
    );
    ResponseHandler.success(
      res,
      result,
      "Category products retrieved successfully"
    );
  }
);

export const getCategory = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Category ID is required");
  }

  const category = await categoryService.getCategoryById(id);
  ResponseHandler.success(res, category, "Category retrieved successfully");
});

export const createCategory = Handler(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = CreateCategoryDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid category data");
  }

  const category = await categoryService.createCategory(validationResult.data);
  ResponseHandler.created(res, category, "Category created successfully");
});

export const updateCategory = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Category ID is required");
  }

  // Validate request body
  const validationResult = UpdateCategoryDto.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError("Invalid category data");
  }

  const updatedCategory = await categoryService.updateCategory(
    id,
    validationResult.data
  );
  ResponseHandler.success(
    res,
    updatedCategory,
    "Category updated successfully"
  );
});

export const deleteCategory = Handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ValidationError("Category ID is required");
  }

  await categoryService.deleteCategory(id);
  ResponseHandler.success(res, null, "Category deleted successfully");
});
