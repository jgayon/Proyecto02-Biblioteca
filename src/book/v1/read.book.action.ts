import { BookModel, BookType } from "./book.model";

export default async function readBookAction(id: string): Promise<BookType | null> {
  // Buscar solo libros activos (no soft deleted)
  const book = await BookModel.findOne({ _id: id, active: true }).lean();

  return book as BookType | null;
}
