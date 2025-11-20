import { BookModel } from "../../book/v1/book.model";
import { UserModel } from "../../user/v1/user.model";

export default async function reserveBookAction(
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

  // Validar disponibilidad
  if (!book.available) {
    throw new Error("El libro no está disponible para reserva.");
  }

  const now = new Date();

  // Registrar en historial del libro
  book.history.push({
    userId: user._id.toString(),
    userName: user.name,
    reservedAt: now,
  });

  // Registrar en historial del usuario
  user.history.push({
    bookId: book._id.toString(),
    bookTitle: book.title,
    reservedAt: now,
  });

  // Marcar libro como no disponible
  book.available = false;

  
  await user.save();
  await book.save();
  return book;
}
