import { Context } from "hono";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema";
import { UserService } from "../services/userService";
import { ZodError } from "zod";

export const getAllUsers = async (c: Context) => {
  try {
    const users = await UserService.getAllUsers();
    return c.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    return c.json({ error: "Failed to get users" }, 500);
  }
};

export const getUserById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    const user = await UserService.findById(id);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return c.json({ error: "Failed to get user" }, 500);
  }
};

export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = createUserSchema.parse(body);

    const user = await UserService.createUser(validatedData);
    return c.json(user, 201);
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    if (error instanceof ZodError) {
      return c.json({ error: "Invalid input data" }, 400);
    }
    if (
      error instanceof Error &&
      error.message === "Un utilisateur avec cet email existe déjà"
    ) {
      return c.json({ error: error.message }, 409);
    }
    return c.json({ error: "Failed to create user" }, 500);
  }
};

export const getCurrentUser = async (c: Context) => {
  console.log("getCurrentUser", c.get("user"));
  try {
    const userContext = c.get("user");
    console.log("userContext : ", userContext);
    const userId = userContext.userId;

    console.log("userId : ", userId);
    if (!userId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const user = await UserService.getCurrentUser(userId);

    console.log("user : ", user);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return c.json({ error: "Failed to get current user" }, 500);
  }
};

export const updateUser = async (c: Context) => {
  try {
    const userId = parseInt(c.req.param("id"));
    if (isNaN(userId)) {
      return c.json({ error: "Invalid user ID" }, 400);
    }

    const body = await c.req.json();
    const validatedData = updateUserSchema.parse(body);

    const user = await UserService.updateUser(userId, validatedData);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof ZodError) {
      return c.json({ error: "Invalid input data" }, 400);
    }
    return c.json({ error: "Failed to update user" }, 500);
  }
};
