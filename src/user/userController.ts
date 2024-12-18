import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation first -> process -> Response
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required");
    next(error);
    return;
  }

  // Database Call.
  const user = await userModel.findOne({ email });
  if (user !== null) {
    const error = createHttpError(400, "User Already Exists..");
    return next(error);
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create New User
  const newUser = await userModel.create({
    name,
    password: hashedPassword,
    email,
  });

  // Token Generation

  res.json({ message: "User Created", id: newUser._id });
};

export { createUser };
