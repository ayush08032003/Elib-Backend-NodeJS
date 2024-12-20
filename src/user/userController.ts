import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./userModel";
import { config } from "../config/config";
import { rmSync } from "fs";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation first -> process -> Response
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required");
    next(error);
    return;
  }

  // Database Call.

  try {
    const user = await userModel.findOne({ email });
    if (user !== null) {
      const error = createHttpError(400, "User Already Exists..");
      return next(error);
    }
  } catch (err) {
    return next(
      createHttpError(500, "createUser :: Error While Finding User in Database")
    );
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create New User
  const newUser = await userModel.create({
    name,
    password: hashedPassword,
    email,
  });

  // Token Generation - JWT
  const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  res.status(201).json({ message: "User Created", accessToken: token });
  // make sure to have 201 status code as this creates a new resource.
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All Fields are Required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (user === null) {
      next(createHttpError(404, "User Not Found"));
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        createHttpError(
          401,
          "Invalid Credentials - User and Password Not Match.!"
        )
      );
    }

    const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.json({ message: "Login Successfully", accessToken: token });
    return;
  } catch (err) {
    next(
      createHttpError(500, "loginUser :: Error While Finding User in Database")
    );
    return;
  }
  res.json({ message: "Login Successfully" });
};

export { createUser, loginUser };
