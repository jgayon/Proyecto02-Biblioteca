import { BookType } from "./book.model";

import createBookAction from "./create.book.action";
import readBookAction from "./read.book.action";
import filterBooksAction from "./filter.book.action";
import updateBookAction from "./update.book.action";
import deleteBookAction from "./delete.book.action";

// Crear
async function createBook(data: Partial<BookType>): Promise<BookType> {
  const newBook = await createBookAction(data);
  return newBook;
}

// Read
async function readBook(id: string): Promise<BookType | null> {
  const book = await readBookAction(id);
  return book;
}

//Con Filters
async function filterBooks(filters: any) {
  const results = await filterBooksAction(filters);
  return results;
}

// Update
async function updateBook(
  id: string,
  data: Partial<BookType>
): Promise<BookType | null> {
  const updated = await updateBookAction(id, data);
  return updated;
}

// Soft Delete
async function deleteBook(id: string): Promise<BookType | null> {
  const deleted = await deleteBookAction(id);
  return deleted;
}


export {
  createBook,
  readBook,
  filterBooks,
  updateBook,
  deleteBook,
};
