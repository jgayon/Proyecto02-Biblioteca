import { BookModel, BookType } from "./book.model";

export default async function deleteBookAction(id: string): Promise<BookType | null> {
  
  const deletedBook = await BookModel.findOneAndUpdate(
    { _id: id, active: true },      
    { active: false },              
    { new: true }                   
  ).lean();

  return deletedBook as BookType | null;
}
