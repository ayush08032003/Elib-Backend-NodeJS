import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlwares/globalErrorHandler";
import userRouter from "./user/userRouter";

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

app.use("/api/users", userRouter);

// Global Error Handler.
app.use(globalErrorHandler);

export default app;
