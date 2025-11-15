import { UserModel, UserType } from "./user.model";

export default async function readUserByIdAction(id: string): Promise<UserType | null> {
  const user = await UserModel.findOne({ _id: id, active: true }).lean();
  return user as UserType | null;
}
