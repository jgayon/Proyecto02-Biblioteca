import { BookModel, BookType } from "./book.model";

export default async function createBookAction(
  data: Partial<BookType>
): Promise<BookType> {

  // Validar titulo
  if (!data.title) {
    throw new Error("El título del libro es obligatorio");
  }

  // Validar si ya existe
  const existing = await BookModel.findOne({ title: data.title });
  if (existing) {
    throw new Error("El libro ya existe");
  }

  // Crear el libro
  const newBook = await BookModel.create({
    ...data,
    available: true,   
    active: true,      
    history: [],       
  });

  return newBook;
}
