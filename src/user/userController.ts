import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation first -> process -> Response
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required");
    next(error);
    return;
  }

  // Database Call.
  const user = await User.findOne({ email });
  if (user !== null) {
    const error = createHttpError(400, "User Already Exists..");
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  

  res.json({ message: "User Created" });
};

export { createUser };
