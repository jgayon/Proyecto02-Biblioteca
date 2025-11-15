import { UserModel, UserType } from "./user.model";

// DECLARE ACTION FUNCTION
export default async function readUsersAction(): Promise<UserType[]> {
  // Solo usuarios activos (soft delete)
  const results = await UserModel.find({ active: true }).lean();

  return results as UserType[];
}