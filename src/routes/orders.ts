import { Router } from "express";

import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  orderByUserId,
} from "../controllers";
const router = Router();

router
  .get("/", getAllOrders)
  .get("/:id", getOrder)
  .get("/user/:id", orderByUserId)
  .post("/", createOrder)
  .patch("/:id", updateOrder)
  .delete("/:id", deleteOrder);

export { router as ordersRouter };
