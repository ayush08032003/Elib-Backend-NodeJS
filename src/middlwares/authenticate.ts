import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface CustomRequest extends Request {
  userId: string;
}

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
