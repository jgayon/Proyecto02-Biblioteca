import reserveBookAction from "./reserveBook.action";
import returnBookAction from "./returnBook.action";

import { UserModel } from "../../user/v1/user.model";
import { BookModel } from "../../book/v1/book.model";

// Reserve Book
async function reserveBook(userId: string, bookId: string) {
  const result = await reserveBookAction(userId, bookId);
  return result;
}

// Return Book
async function returnBook(userId: string, bookId: string) {
  const result = await returnBookAction(userId, bookId);
  return result;
}

// Historial User
async function getUserHistory(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user || !user.active) {
    throw new Error("Usuario no encontrado o inhabilitado.");
  }

  return user.history;
}

// Historial Book
async function getBookHistory(bookId: string) {
  const book = await BookModel.findById(bookId);

  if (!book || !book.active) {
    throw new Error("Libro no encontrado o inhabilitado.");
  }

  return book.history;
}

export {
  reserveBook,
  returnBook,
  getUserHistory,
  getBookHistory
};
