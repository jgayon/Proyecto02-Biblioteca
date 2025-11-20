import { BookModel, BookType } from "./book.model";

export default async function updateBookAction(
  id: string,
  data: Partial<BookType>
): Promise<BookType | null> {

  const forbiddenFields = ["_id", "active", "history", "createdAt", "updatedAt"];
  forbiddenFields.forEach((field) => delete (data as any)[field]);

  // Update solo si esta activo
  const updatedBook = await BookModel.findOneAndUpdate(
    { _id: id, active: true },
    data,
    { new: true }  
  ).lean();

  return updatedBook as BookType | null;
}
