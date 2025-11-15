import { UserModel, UserType } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function loginUserAction(
  email: string,
  password: string
): Promise<{ token: string; user: UserType }> {
  
  const user = await UserModel.findOne({ email, active: true });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Credenciales inválidas");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      permissions: user.permissions,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  return { token, user };
}
