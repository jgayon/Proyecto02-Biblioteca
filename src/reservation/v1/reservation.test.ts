import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { UserModel } from "../../user/v1/user.model";
import { BookModel } from "../../book/v1/book.model";

import reserveBookAction from "./reserveBook.action";
import returnBookAction from "./returnBook.action";
import { getUserHistory, getBookHistory } from "./reservation.controller";

let mongoServer: MongoMemoryServer;

describe("Reservation Module Tests", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await BookModel.deleteMany({});
  });

  test("Should reserve a book successfully", async () => {
    const user = await UserModel.create({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "123456",
      permissions: {},
      history: [],
    });

    const book = await BookModel.create({
      title: "El Quijote",
      author: "Cervantes",
      genre: "Novela",
      publisher: "Editorial X",
      publishedAt: new Date(),
      available: true,
      active: true,
      history: [],
    });

    const result = await reserveBookAction(user._id.toString(), book._id.toString());

    expect(result.available).toBe(false);
    expect(result.history.length).toBe(1);
    expect(result.history[0].userName).toBe("Juan Pérez");
  });

  test("Should NOT reserve an already reserved book", async () => {
    const user = await UserModel.create({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "123456",
      permissions: {},
      history: [],
    });

    const book = await BookModel.create({
      title: "Harry Potter",
      author: "J.K. Rowling",
      genre: "Fantasia",
      publisher: "Bloomsbury",
      publishedAt: new Date(),
      available: true,
      active: true,
      history: [],
    });

    // Primera reservation
    await reserveBookAction(user._id.toString(), book._id.toString());

    // Segunda (Debe fallar)
    await expect(
      reserveBookAction(user._id.toString(), book._id.toString())
    ).rejects.toThrow("El libro no está disponible para reserva.");
  });

  test("Should return a book successfully", async () => {
    const user = await UserModel.create({
      name: "Carlos Ruiz",
      email: "carlos@example.com",
      password: "123456",
      permissions: {},
      history: [],
    });

    const book = await BookModel.create({
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      genre: "Realismo Mágico",
      publisher: "Sudamericana",
      publishedAt: new Date(),
      available: true,
      active: true,
      history: [],
    });

    await reserveBookAction(user._id.toString(), book._id.toString());

    const result = await returnBookAction(user._id.toString(), book._id.toString());

    expect(result.available).toBe(true);
    expect(result.history[0].deliveredAt).toBeDefined();
  });

  test("Should get user reservation history", async () => {
    const user = await UserModel.create({
      name: "Ana Torres",
      email: "ana@example.com",
      password: "123456",
      permissions: {},
      history: [],
    });

    const book = await BookModel.create({
      title: "1984",
      author: "George Orwell",
      genre: "Distopia",
      publisher: "Secker & Warburg",
      publishedAt: new Date(),
      available: true,
      active: true,
      history: [],
    });

    await reserveBookAction(user._id.toString(), book._id.toString());

    const history = await getUserHistory(user._id.toString());

    expect(history.length).toBe(1);
    expect(history[0].bookTitle).toBe("1984");
  });

  test("Should get book reservation history", async () => {
    const user = await UserModel.create({
      name: "Luis Gómez",
      email: "luis@example.com",
      password: "123456",
      permissions: {},
      history: [],
    });

    const book = await BookModel.create({
      title: "Crónica de una Muerte Anunciada",
      author: "García Márquez",
      genre: "Novela",
      publisher: "Debolsillo",
      publishedAt: new Date(),
      available: true,
      active: true,
      history: [],
    });

    await reserveBookAction(user._id.toString(), book._id.toString());

    const history = await getBookHistory(book._id.toString());

    expect(history.length).toBe(1);
    expect(history[0].userName).toBe("Luis Gómez");
  });
});
