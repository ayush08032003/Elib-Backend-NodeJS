import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlwares/globalErrorHandler";

const app = express();

// Routes..
// HTTP MEHTODS: GET,  POST, PUT, DELETE, PATCH etc..
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: "Hello World" });
    // const error = createHttpError(404, "Not Found");
    // throw error;
  } catch (error) {
    next(error);
  }
});

// Global Error Handler.
app.use(globalErrorHandler);

export default app;
