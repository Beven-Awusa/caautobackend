import { Router } from "express";

import {
  profile,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers";

const router = Router();

router
  .get("/profile", profile)
  .put("/profile", updateProfile)
  .get("/users", getAllUsers)
  .get("/users/:id", getUser)
  .put("/users/:id", updateUser)
  .delete("/users/:id", deleteUser);

export { router as usersRouter };
