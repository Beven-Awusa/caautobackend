import { Router } from "express";

import {
  getCart,
  addToCart,
  updateCart,
  deleteFromCart,
  clearCart,
} from "../controllers";

const router = Router();

router
  .get("/", getCart)
  .post("/", addToCart)
  .patch("/:id", updateCart)
  .delete("/:id", deleteFromCart)
  .delete("/clear", clearCart);

export { router as cartRouter };
