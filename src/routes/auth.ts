import { Router } from "express";

import {
  login,
  register,
  logout,
  refresh,
  verify,
  forgotPassword,
  resetPassword,
} from "../controllers";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout)
  .post("/refresh", refresh)
  .post("/verify", verify)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", resetPassword);

export { router as authRouter };
