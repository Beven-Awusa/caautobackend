import { Router } from "express";

import {
  getAllCategories,
  getCategoryProducts,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers";

const router = Router();

router
  .get("/", getAllCategories)
  .get("/:id", getCategory)
  .get("/:id/products", getCategoryProducts)
  .post("/", createCategory)
  .patch("/:id", updateCategory)
  .delete("/:id", deleteCategory);

export { router as categoriesRouter };
