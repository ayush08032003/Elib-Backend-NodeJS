import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./userModel";
import { config } from "../config/config";
import { rmSync } from "fs";

/**
 * Creates a new user in the database after validating the input data, hashing the password, and generating a JWT token.
 *
 * @param {Request} req - The incoming HTTP request containing the user details (name, email, password) in the body.
 * @param {Response} res - The outgoing HTTP response, which will contain a message and the generated JWT token upon successful creation.
 * @param {NextFunction} next - The next middleware function, used to handle errors or pass control to the next middleware.
 *
 * @returns {void} Responds with a success message and a JWT token upon successful user creation.
 *
 * @throws {HttpError} 400 - If any required fields (name, email, password) are missing or if the user already exists.
 * @throws {HttpError} 500 - If there’s an error during the database operation or hashing the password.
 */
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

/**
 * Authenticates a user by verifying their credentials (email and password) and generates a JWT token on successful login.
 *
 * @param {Request} req - The incoming HTTP request containing the user’s email and password in the body.
 * @param {Response} res - The outgoing HTTP response, which will contain the success message and generated JWT token upon successful login.
 * @param {NextFunction} next - The next middleware function, used to handle errors or pass control to the next middleware.
 *
 * @returns {void} Responds with a success message and a JWT token if authentication is successful.
 *
 * @throws {HttpError} 400 - If either email or password is missing in the request body.
 * @throws {HttpError} 404 - If the user is not found in the database.
 * @throws {HttpError} 401 - If the provided password does not match the stored password.
 * @throws {HttpError} 500 - If there is an error during the database operation or authentication process.
 */
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
