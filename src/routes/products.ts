import { Router } from "express";

import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
  getProductByCategory,
} from "../controllers";

import { authenticate, optionalAuth } from "../middleware/auth";
import {
  uploadMultipleImages,
  validateProductImages,
  cleanupOnError,
} from "../middleware/upload";

const router = Router();

// Public routes (no authentication required)
router
  .get("/", optionalAuth, getAllProducts)
  .get("/:id", getProduct)
  .get("/:id/reviews", getProductReviews)
  .get("/category/:id", getProductByCategory);

// Protected routes (authentication required)
router
  .post(
    "/",
    authenticate,
    uploadMultipleImages,
    cleanupOnError,
    validateProductImages,
    createProduct
  )
  .patch("/:id", authenticate, updateProduct)
  .delete("/:id", authenticate, deleteProduct)
  .post("/:id/reviews", authenticate, createProductReview);

export { router as productsRouter };
