import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import passport from "passport";

import {
  authRouter,
  usersRouter,
  productsRouter,
  categoriesRouter,
  ordersRouter,
  cartRouter,
} from "./routes";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const Application = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());

  app.use(morgan("combined"));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(passport.initialize());

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/cart", cartRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
};
