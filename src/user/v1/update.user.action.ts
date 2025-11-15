import { UserModel, UserType } from "./user.model";
import bcrypt from "bcrypt";

export default async function updateUserAction(
  id: string,
  data: Partial<UserType>
): Promise<UserType | null> {

  const updateData: any = { ...data };

  //Hashear por cambio de contraseña
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: id, active: true },
    updateData,
    { new: true }
  );

  return updatedUser;
}
