import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation first -> process -> Response
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required");
    next(error);
    return;
  }

  res.json({ message: "User Created" });
};

export { createUser };
