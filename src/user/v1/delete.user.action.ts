import { UserModel, UserType } from "./user.model";

export default async function deleteUserAction(id: string): Promise<UserType | null> {
  const deletedUser = await UserModel.findOneAndUpdate(
    { _id: id },
    { active: false },
    { new: true }
  );

  return deletedUser;
}
