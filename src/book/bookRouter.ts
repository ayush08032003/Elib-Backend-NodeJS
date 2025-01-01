import path from "node:path";
import express from "express";
import {
  bookRegister,
  getSingleBook,
  listBooks,
  updateBook,
} from "./bookController";
import multer from "multer";
import authenticate from "../middlwares/authenticate";

const bookRouter = express.Router();

/*
How multer works: 
local file System -> 
*/
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fieldSize: 3e7 }, // TOOD: need to change this size limit.
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

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/", listBooks);
bookRouter.get("/:bookId", getSingleBook);
export default bookRouter;
