import { Router, Request, Response } from "express";

import {
  createUser,
  loginUser,
  readUsers,
  readUserById,
  updateUser,
  deleteUser
} from "./user.controller";

import authMiddleware from "../../middlewares/auth.middleware"; 
import permissionMiddleware from "../../middlewares/permission.middleware";

// INIT ROUTER
const userRoutes = Router();

// Create User
userRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login
userRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      message: "Login exitoso",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Get all users
userRoutes.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const users = await readUsers();

    res.status(200).json({
      message: "Usuarios encontrados",
      users,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User by Id
userRoutes.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await readUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario encontrado",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});


// Update User-
userRoutes.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("canEditUsers"),
  async (req: Request, res: Response) => {
    try {
      const updatedUser = await updateUser(req.params.id, req.body);

      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json({
        message: "Usuario actualizado",
        user: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);


// Delete User (Soft)
userRoutes.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("canDisableUsers"),
  async (req: Request, res: Response) => {
    try {
      const deletedUser = await deleteUser(req.params.id);

      if (!deletedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json({
        message: "Usuario inhabilitado",
        user: deletedUser,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// EXPORT ROUTES
export default userRoutes;
