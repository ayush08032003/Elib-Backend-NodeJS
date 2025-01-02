import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middlwares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import { config } from "./config/config";
const app = express();
app.use(express.json()); // this is neccessary as , without it, req.body will remains undefined.
app.use(
  cors({
    origin: config.fontend_domain,
  })
);

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
app.use("/api/books", bookRouter);

// Global Error Handler.
app.use(globalErrorHandler);

export default app;
