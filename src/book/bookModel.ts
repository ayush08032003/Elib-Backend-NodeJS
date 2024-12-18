import mongoose from "mongoose";
import { IBook } from "./bookTypes";

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: mongoose.Schema.ObjectId, required: true },
    coverImage: { type: String, required: true },
    file: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", bookSchema);
