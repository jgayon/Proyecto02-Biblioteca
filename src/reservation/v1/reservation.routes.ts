import { Router, Request, Response } from "express";

import {
  reserveBook,
  returnBook,
  getUserHistory,
  getBookHistory,
} from "./reservation.controller";

import authMiddleware from "../../middlewares/auth.middleware";

const reservationRoutes = Router();

// Reserve libro
reservationRoutes.post(
  "/:bookId/reserve",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { bookId } = req.params;

      const result = await reserveBook(userId, bookId);

      res.status(200).json({
        message: "Libro reservado exitosamente.",
        book: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Return Libro
reservationRoutes.post(
  "/:bookId/return",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { bookId } = req.params;

      const result = await returnBook(userId, bookId);

      res.status(200).json({
        message: "Libro devuelto exitosamente.",
        book: result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Historial Usuario
reservationRoutes.get(
  "/user/:userId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const history = await getUserHistory(userId);

      res.status(200).json({
        message: "Historial del usuario obtenido correctamente.",
        history,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Historial Libro
reservationRoutes.get(
  "/book/:bookId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { bookId } = req.params;

      const history = await getBookHistory(bookId);

      res.status(200).json({
        message: "Historial del libro obtenido correctamente.",
        history,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default reservationRoutes;
