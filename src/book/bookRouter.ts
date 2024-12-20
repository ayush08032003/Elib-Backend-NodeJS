import path from "node:path";
import express from "express";
import { bookRegister } from "./bookController";
import multer from "multer";
import authenticate from "../middlwares/authenticate";

const bookRouter = express.Router();

/*
How multer works: 
local file System -> 
*/
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fieldSize: 3e7 },
});

bookRouter.post(
  "/register",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  bookRegister
);

export default bookRouter;
