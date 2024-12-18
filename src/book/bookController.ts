import { NextFunction, Request, Response } from "express";

const bookRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Book Registered Successfully" });
};

export { bookRegister };
