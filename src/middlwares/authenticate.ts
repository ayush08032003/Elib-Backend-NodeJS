import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface CustomRequest extends Request {
  userId: string;
}

/**
 * Middleware function to authenticate a user based on the Authorization token in the request header.
 * It verifies the token and adds the user ID to the request object for further processing.
 * 
 * @param {Request} req - The incoming HTTP request, expected to contain an Authorization header with the token.
 * @param {Response} res - The outgoing HTTP response, which is not used in this function.
 * @param {NextFunction} next - The next middleware function to call if authentication is successful, or an error handler if it fails.
 * 
 * @throws {HttpError} 401 - If the token is missing or invalid.
 * 
 * @returns {void} Calls the next middleware if authentication succeeds.
 */
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authorization Token is Required..!"));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecret as string);
    // console.log("decoded", decoded);
    (req as CustomRequest).userId = decoded.sub as string;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid Token"));
  }

  return;
};

export default authenticate;
