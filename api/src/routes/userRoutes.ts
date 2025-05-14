import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  getAllUsers,
  getUserById,
  createUser,
  getCurrentUser,
  updateUser,
} from "../controllers/userController";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema";
import { authMiddleware } from "../middleware/auth";

const userRouter = new Hono();

// Routes protégées par authentification
userRouter.use("*", authMiddleware);

userRouter.get("/", getAllUsers);
userRouter.get("/me", getCurrentUser);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", zValidator("json", updateUserSchema), updateUser);
userRouter.post("/", zValidator("json", createUserSchema), createUser);

export default userRouter;
