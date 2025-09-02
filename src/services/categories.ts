// Category service functions
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryDto,
  CategoryListResponse,
} from "../dto/categories";
import type { ProductQueryDto, ProductListResponse } from "../dto/products";
import { NotFoundError, ForbiddenError } from "../utils/errors";

export const getAllCategories = async (
  query: CategoryQueryDto
): Promise<CategoryListResponse> => {
  // TODO: Implement get all categories
  // 1. Apply filters (search, isActive)
  // 2. Apply sorting
  // 3. Apply pagination
  // 4. Count products for each category
  // 5. Return categories with pagination info
  throw new Error("Not implemented");
};

export const getCategoryProducts = async (
  categoryId: string,
  query: Omit<ProductQueryDto, "categoryId">
): Promise<ProductListResponse> => {
  // TODO: Implement get products by category
  // 1. Verify category exists
  // 2. Get products filtered by category
  // 3. Apply additional filters and pagination
  // 4. Return products with pagination info
  throw new Error("Not implemented");
};

export const getCategoryById = async (id: string): Promise<Category> => {
  // TODO: Implement get category by ID
  // 1. Find category by ID
  // 2. Throw NotFoundError if category doesn't exist
  // 3. Return category data
  throw new Error("Not implemented");
};

export const createCategory = async (
  categoryData: CreateCategoryDto
): Promise<Category> => {
  // TODO: Implement create category
  // 1. Validate category data
  // 2. Check if category name already exists
  // 3. Create category in database
  // 4. Return created category
  throw new Error("Not implemented");
};

export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  // TODO: Implement update category
  // 1. Find category by ID
  // 2. Validate update data
  // 3. Check if new name conflicts with existing categories
  // 4. Update category in database
  // 5. Return updated category
  throw new Error("Not implemented");
};

export const deleteCategory = async (id: string): Promise<void> => {
  // TODO: Implement delete category
  // 1. Find category by ID
  // 2. Check if category has products (prevent deletion if has products)
  // 3. Delete category from database
  throw new Error("Not implemented");
};
