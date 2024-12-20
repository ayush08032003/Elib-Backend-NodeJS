import path from "node:path";
import fs from "node:fs";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { CustomRequest } from "../middlwares/authenticate";

const bookRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // this is from stackoverflow..

    const { title, genre, description } = req.body;
    // console.log("files", req.files);
    if (!title || !genre || !req.files) {
      return next(createHttpError(400, "All Fields are Required"));
    }

    // upload Cover Image to cloudinary
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    // From multer, we get mineType: 'image/jpeg', but in cloudinary, we need mimeType: 'jpeg'

    const fileName = files.coverImage[0].filename;
    const filePath = files.coverImage[0].path;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // console.log("uploadResult", uploadResult);

    // Upload Book-pdf to cloudinary
    const bookFileName = files.file[0].filename;
    const bookFilePath = files.file[0].path;

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    // console.log("bookFileUploadResult", bookFileUploadResult);
    // Fetch UserId using authenticate middleware.

    const author = (req as CustomRequest).userId;

    // Create Data - make data like file url and cover url stores in Database.
    const newBook = await bookModel.create({
      title,
      genre,
      author,
      description,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete Temporary files from public/data/uploads
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      next(
        createHttpError(
          500,
          "Error While Deleting Temporary Cover Image and File."
        )
      );
    }

    res
      .status(201)
      .json({ message: "Book Registered Successfully", id: newBook._id });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Error While Uploading Book & Cover Image"));
  }
};

export { bookRegister };
