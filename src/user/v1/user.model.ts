import { model, Schema, Document } from "mongoose";

// Tipo Reserve History
export interface UserHistoryItem {
  bookId: string;
  bookTitle: string;
  reservedAt: Date;
  deliveredAt?: Date;
}

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
  history: UserHistoryItem[];
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
      type: String,
      required: true,
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

    //Historial de Reserva
    history: [
      {
        bookId: { type: String, required: true },
        bookTitle: { type: String, required: true },
        reservedAt: { type: Date, required: true },
        deliveredAt: { type: Date }, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

// DECLARE MONGO MODEL
const UserModel = model<UserType>("User", UserSchema);

// EXPORT ALL
export { UserModel, UserSchema };
