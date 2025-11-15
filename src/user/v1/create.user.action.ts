import { UserModel, UserType } from "./user.model";
import bcrypt from "bcrypt";

export default async function createUserAction(data: Partial<UserType>): Promise<UserType> {
  // Validar email
  const existing = await UserModel.findOne({ email: data.email });
  if (existing) {
    throw new Error("El correo ya está registrado");
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(data.password!, 10);

  const user = await UserModel.create({
    ...data,
    password: hashedPassword,
  });

  return user;
}
