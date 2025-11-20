import { Router, Request, Response } from "express";

import {
  createBook,
  readBook,
  filterBooks,
  updateBook,
  deleteBook,
} from "./book.controller";

import authMiddleware from "../../middlewares/auth.middleware";
import permissionMiddleware from "../../middlewares/permission.middleware";

// Init Router
const bookRoutes = Router();

// Create
bookRoutes.post(
  "/",
  authMiddleware,
  permissionMiddleware("canCreateBook"),
  async (req: Request, res: Response) => {
    try {
      const newBook = await createBook(req.body);

      res.status(201).json({
        message: "Libro creado exitosamente",
        book: newBook,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Read
bookRoutes.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await readBook(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.status(200).json({
      message: "Libro encontrado",
      book,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Read con filtros
bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const filters = {
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      title: req.query.title as string,
      author: req.query.author as string,
      genre: req.query.genre as string,
      publisher: req.query.publisher as string,
      available: req.query.available ? req.query.available === "true" : undefined,
      publishedAt: req.query.publishedAt as string,
    };

    const result = await filterBooks(filters);

    res.status(200).json({
      message: "Libros encontrados",
      ...result, 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update
bookRoutes.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("canEditBook"),
  async (req: Request, res: Response) => {
    try {
      const updated = await updateBook(req.params.id, req.body);

      if (!updated) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.status(200).json({
        message: "Libro actualizado",
        book: updated,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete
bookRoutes.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("canDeleteBook"),
  async (req: Request, res: Response) => {
    try {
      const deleted = await deleteBook(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.status(200).json({
        message: "Libro inhabilitado correctamente",
        book: deleted,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);


export default bookRoutes;
