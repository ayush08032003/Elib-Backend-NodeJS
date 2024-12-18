import mongoose from "mongoose";
import { IUser } from "./UserTypes";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
