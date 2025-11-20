import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  createBook,
  readBook,
  filterBooks,
  updateBook,
  deleteBook,
} from "./book.controller";

import { BookModel } from "./book.model";

// Setup el DB Mongo
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await BookModel.deleteMany({});
});

// TESTS

describe("Book Controller Tests", () => {
  
  // Create
  it("debe crear un libro exitosamente", async () => {
    const book = await createBook({
      title: "El Quijote",
      author: "Cervantes",
      genre: "Ficción",
      publisher: "Planeta",
      publishedAt: new Date("1605-01-01")
    });

    expect(book).toHaveProperty("_id");
    expect(book.title).toBe("El Quijote");
    expect(book.available).toBe(true);
  });

  it("debe fallar al crear un libro duplicado", async () => {
    await createBook({
      title: "Duplicado",
      author: "Autor",
      genre: "Drama",
      publisher: "Editorial X",
      publishedAt: new Date()
    });

    await expect(
      createBook({
        title: "Duplicado",
        author: "Otro",
        genre: "Ficción",
        publisher: "Otra Editorial",
        publishedAt: new Date()
      })
    ).rejects.toThrow("El libro ya existe");
  });

  // Read
  it("debe retornar un libro por su ID", async () => {
    const created = await createBook({
      title: "Libro A",
      author: "Autor A",
      genre: "Comedia",
      publisher: "Ed A",
      publishedAt: new Date()
    });

    const found = await readBook(created._id.toString());

    expect(found!.title).toBe("Libro A");
  });

  it("no debe retornar libros eliminados", async () => {
    const created = await createBook({
      title: "Eliminar",
      author: "Autor",
      genre: "Acción",
      publisher: "Ed B",
      publishedAt: new Date()
    });

    await deleteBook(created._id.toString());

    const found = await readBook(created._id.toString());
    expect(found).toBe(null);
  });

  // Filter + paginacion
  it("debe filtrar libros por género", async () => {
    await createBook({
      title: "Aventura 1",
      author: "Autor X",
      genre: "Aventura",
      publisher: "Ed X",
      publishedAt: new Date()
    });

    await createBook({
      title: "Comedia 1",
      author: "Autor Y",
      genre: "Comedia",
      publisher: "Ed Y",
      publishedAt: new Date()
    });

    const result = await filterBooks({ genre: "Aventura" });

    expect(result.books.length).toBe(1);
    expect(result.books[0].title).toBe("Aventura 1");
  });

  it("debe aplicar paginación correctamente", async () => {
    for (let i = 1; i <= 15; i++) {
      await createBook({
        title: `Libro ${i}`,
        author: "Massive",
        genre: "Test",
        publisher: "Ed Test",
        publishedAt: new Date()
      });
    }

    const page1 = await filterBooks({ page: 1, limit: 10 });
    const page2 = await filterBooks({ page: 2, limit: 10 });

    expect(page1.books.length).toBe(10);
    expect(page2.books.length).toBe(5);
    expect(page1.totalPages).toBe(2);
  });

  // Update
  it("debe actualizar la información de un libro", async () => {
    const book = await createBook({
      title: "Original",
      author: "Autor O",
      genre: "Drama",
      publisher: "Ed O",
      publishedAt: new Date()
    });

    const updated = await updateBook(book._id.toString(), {
      title: "Modificado",
      publisher: "Ed Nueva"
    });

    expect(updated!.title).toBe("Modificado");
    expect(updated!.publisher).toBe("Ed Nueva");
  });

  // Delete
  it("debe inhabilitar (soft delete) un libro", async () => {
    const book = await createBook({
      title: "Para borrar",
      author: "Autor B",
      genre: "Terror",
      publisher: "Ed B",
      publishedAt: new Date()
    });

    await deleteBook(book._id.toString());

    const deleted = await BookModel.findById(book._id);
    expect(deleted!.active).toBe(false);
  });
});
