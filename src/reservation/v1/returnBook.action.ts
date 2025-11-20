import { UserModel } from "../../user/v1/user.model";
import { BookModel } from "../../book/v1/book.model";

export default async function returnBookAction(
  userId: string,
  bookId: string
) {
  // Buscar usuario
  const user = await UserModel.findById(userId);
  if (!user || !user.active) {
    throw new Error("Usuario no encontrado o está inhabilitado.");
  }

  // Buscar libro
  const book = await BookModel.findById(bookId);
  if (!book || !book.active) {
    throw new Error("Libro no encontrado o está inhabilitado.");
  }

  // Buscar reserva activa en el libro
  const bookHistory = book.history.find(
    (h) => h.userId === userId && !h.deliveredAt
  );

  if (!bookHistory) {
    throw new Error("Este usuario no tiene este libro reservado.");
  }

  // Buscar reserva activa en el usuario
  const userHistory = user.history.find(
    (h) => h.bookId === bookId && !h.deliveredAt
  );

  if (!userHistory) {
    throw new Error("El usuario no tiene una reserva activa de este libro.");
  }

  const now = new Date();

  // Registrar fecha de entrega
  bookHistory.deliveredAt = now;
  userHistory.deliveredAt = now;

  // Marcar el libro como disponible 
  book.available = true;

  await user.save();
  await book.save();

  return book;
}
