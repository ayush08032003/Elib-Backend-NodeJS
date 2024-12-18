import express from "express";
import { bookRegister } from "./bookController";

const bookRouter = express.Router();

bookRouter.post("/register", bookRegister);

export default bookRouter;
