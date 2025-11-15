import { UserModel, UserType } from "./user.model";

import readUsersAction from "./read.user.action";
import readUserByIdAction from "./read.userById.action";
import createUserAction from "./create.user.action";
import updateUserAction from "./update.user.action";
import deleteUserAction from "./delete.user.action";
import loginUserAction from "./login.user.action";

// Create
async function createUser(data: Partial<UserType>): Promise<UserType> {
  const createdUser = await createUserAction(data);
  return createdUser;
}

// Login
async function loginUser(email: string, password: string): Promise<UserType> {
  const user = await loginUserAction(email, password);
  return user;
}

// Read Users
async function readUsers(): Promise<UserType[]> {
  const users = await readUsersAction();
  return users;
}

// Read by UserId
async function readUserById(id: string): Promise<UserType | null> {
  const user = await readUserByIdAction(id);
  return user;
}

// Update
async function updateUser(id: string, data: Partial<UserType>): Promise<UserType | null> {
  const updatedUser = await updateUserAction(id, data);
  return updatedUser;
}


// Soft Delete
async function deleteUser(id: string): Promise<UserType | null> {
  const deletedUser = await deleteUserAction(id);
  return deletedUser;
}

// Export
export {
  createUser,
  loginUser,
  readUsers,
  readUserById,
  updateUser,
  deleteUser
};
