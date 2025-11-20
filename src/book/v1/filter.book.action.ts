import { BookModel, BookType } from "./book.model";

interface BookFilterInput {
  page?: number;
  limit?: number;
  title?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  available?: boolean;
  publishedAt?: string | Date;
}

export default async function filterBooksAction(filters: BookFilterInput) {
  const {
    page = 1,
    limit = 10,
    title,
    author,
    genre,
    publisher,
    available,
    publishedAt,
  } = filters;

  const query: any = { active: true }; // Excluir inactivos

  if (title) query.title = { $regex: title, $options: "i" };
  if (author) query.author = { $regex: author, $options: "i" };
  if (genre) query.genre = { $regex: genre, $options: "i" };
  if (publisher) query.publisher = { $regex: publisher, $options: "i" };

  if (available !== undefined) query.available = available;

  if (publishedAt) query.publishedAt = new Date(publishedAt);

  // Paginación
  const skip = (page - 1) * limit;

  // Buscar solo titulos
  const [books, total] = await Promise.all([
    BookModel.find(query)
      .select("title")       
      .skip(skip)
      .limit(limit)
      .lean(),

    BookModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    totalPages,
    limit,
    totalBooks: total,
    books, 
  };
}
