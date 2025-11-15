import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  createUser,
  loginUser,
  readUsers,
  readUserById,
  updateUser,
  deleteUser,
} from "./user.controller";

import { UserModel } from "./user.model";


// Setup DB de prueba
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
  await UserModel.deleteMany({});
});


// TESTS

describe("User Controller Tests", () => {
  
  //Create User
  it("debe crear un usuario exitosamente", async () => {
    const user = await createUser({
      name: "Test",
      email: "test@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("_id");
    expect(user.email).toBe("test@example.com");
  });

  it("debe fallar al crear usuario con correo duplicado", async () => {
    await createUser({
      name: "Test",
      email: "test@example.com",
      password: "123456",
    });

    await expect(
      createUser({
        name: "Test2",
        email: "test@example.com",
        password: "123456",
      })
    ).rejects.toThrow("El correo ya está registrado");
  });

  // Login
  it("debe loguear un usuario correctamente", async () => {
    await createUser({
      name: "Test",
      email: "login@example.com",
      password: "secret",
    });

    const result = await loginUser("login@example.com", "secret");

    expect(result).toHaveProperty("token");
    expect(result.user.email).toBe("login@example.com");
  });

  it("debe fallar login con contraseña incorrecta", async () => {
    await createUser({
      name: "Test",
      email: "badpass@example.com",
      password: "secret",
    });

    await expect(
      loginUser("badpass@example.com", "wrong")
    ).rejects.toThrow("Credenciales inválidas");
  });

  // Read User
  it("debe retornar usuarios activos", async () => {
    await createUser({
      name: "U1",
      email: "u1@example.com",
      password: "123",
    });

    const users = await readUsers();

    expect(users.length).toBe(1);
  });

  // Read User by ID
  it("debe retornar un usuario por su ID", async () => {
    const u = await createUser({
      name: "U1",
      email: "u1@example.com",
      password: "123",
    });

    const found = await readUserById(u._id.toString());

    expect(found!.email).toBe("u1@example.com");
  });

  it("no debe retornar un usuario eliminado (active: false)", async () => {
    const u = await createUser({
      name: "U2",
      email: "u2@example.com",
      password: "123",
    });

    await deleteUser(u._id.toString());

    const found = await readUserById(u._id.toString());

    expect(found).toBe(null);
  });

  // Update
  it("debe actualizar nombre del usuario", async () => {
    const u = await createUser({
      name: "Old",
      email: "a@a.com",
      password: "123",
    });

    const updated = await updateUser(u._id.toString(), { name: "New Name" });

    expect(updated!.name).toBe("New Name");
  });

  // Delete
  it("debe hacer soft delete correctamente", async () => {
    const u = await createUser({
      name: "DeleteMe",
      email: "delete@example.com",
      password: "123",
    });

    await deleteUser(u._id.toString());

    const deleted = await UserModel.findById(u._id);

    expect(deleted!.active).toBe(false);
  });
});
