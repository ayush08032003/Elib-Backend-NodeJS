import express, { Request, Response } from "express";
import { createUser } from "./userController";

const userRouter = express.Router();
userRouter.post("/register", createUser);

export default userRouter;
