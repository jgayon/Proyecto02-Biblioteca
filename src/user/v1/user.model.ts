import { model, Schema, Document } from "mongoose";

// DECLARE MODEL TYPE
export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  active: boolean;
  permissions: {
    canCreateBook: boolean;
    canEditBook: boolean;
    canDeleteBook: boolean;
    canEditUsers: boolean;
    canDisableUsers: boolean;
  };
}

// DECLARE MONGOOSE SCHEMA
const UserSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    permissions: {
      canCreateBook: { type: Boolean, default: false },
      canEditBook: { type: Boolean, default: false },
      canDeleteBook: { type: Boolean, default: false },
      canEditUsers: { type: Boolean, default: false },
      canDisableUsers: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true, //CreatedAt y UpdatedAt
  }
);

// DECLARE MONGO MODEL
const UserModel = model<UserType>("User", UserSchema);

// EXPORT ALL
export { UserModel, UserSchema };
