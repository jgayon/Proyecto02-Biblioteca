import { model, Schema, Document } from "mongoose";

export interface BookHistoryItem {
  userId: string;
  userName: string;
  reservedAt: Date;
  deliveredAt?: Date;
}

export interface BookType extends Document {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publishedAt: Date;
  available: boolean;
  active: boolean; // soft delete
  history: BookHistoryItem[];
}

const BookSchema = new Schema<BookType>(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publisher: { type: String, required: true },
    publishedAt: { type: Date, required: true },

    available: { type: Boolean, default: true },
    active: { type: Boolean, default: true },

    history: [
      {
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        reservedAt: { type: Date, required: true },
        deliveredAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BookModel = model<BookType>("Book", BookSchema);

export { BookModel, BookSchema };
