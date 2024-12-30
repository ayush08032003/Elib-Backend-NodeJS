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
    // console.log(error);
    next(createHttpError(500, "Error While Uploading Book & Cover Image"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    if (!title || !genre) {
      return next(createHttpError(400, "All Fields are Required"));
    }

    // Find Book in Database
    const findBook = await bookModel.findOne({ _id: bookId });

    // Check if Book is found
    if (!findBook) {
      return next(createHttpError(404, "Book Not Found"));
    }

    // Check if the author is the one who is updating the book.
    if (findBook.author.toString() !== (req as CustomRequest).userId) {
      return next(
        createHttpError(403, "You are not allowed to update this book.")
      );
    }
    // console.log("FindBook: ", findBook);
    let updatedBookCoverImgURL = findBook.coverImage;
    let updatedBookFileURL = findBook.file;

    // Check if coverImage and new File is given to upload or not.
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files && files.coverImage) {
      // console.log("Files : ", files);
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      // From multer, we get mineType: 'image/jpeg', but in cloudinary, we need mimeType: 'jpeg'

      // For uploading the new cover image
      const fileName = files.coverImage[0].filename;
      const filePath = files.coverImage[0].path;

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: "book-covers",
        format: coverImageMimeType,
      });

      // For deleting the old cover image from cloudinary
      if (findBook.coverImage) {
        // checking if there is an old cover image.
        const coverImageUrl = findBook.coverImage;
        const coverIdRegex =
          /book-covers\/([a-zA-Z0-9_-]+)\.(jpg|jpeg|png|gif|bmp|webp)$/;
        const match = coverImageUrl.match(coverIdRegex);

        // console.log("Match", match);

        if (match && match[1]) {
          const coverId = "book-covers/" + match[1]; // Prepending 'book-covers/'
          // console.log(coverId);
          try {
            await cloudinary.uploader.destroy(coverId); // deleting coverImage from cloudinary.
          } catch (error) {
            next(
              createHttpError(500, "Error while Deleting Cover Image Online.!")
            );
          }
        } else {
          return next(
            createHttpError(
              500,
              "Error While Extracting Cover Image Id :: Not in Proper Format"
            )
          );
        }
      }

      updatedBookCoverImgURL = uploadResult.secure_url; // for updating the cover image url in database.

      try {
        await fs.promises.unlink(filePath); // delete the file from the local storage.
      } catch (error) {
        next(
          createHttpError(
            500,
            "Error While Deleting CoverImage from Local Storage..!"
          )
        );
        return;
      }
    }

    // Check if the book file is given to upload or not.
    if (files && files.file) {
      const mineType = files.file[0].mimetype.split("/").at(-1);

      const fileName = files.file[0].filename;
      const filePath = files.file[0].path;

      const bookFileUploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw",
        filename_override: fileName,
        folder: "book-pdfs",
        format: mineType,
      });

      // For deleting Old Book File from Cloudinary.. !
      if (findBook.file) {
        const pdfUrl = findBook.file;
        const pdfIdRegex = /book-pdfs\/([a-zA-Z0-9_-]+)\.pdf/;
        const match = pdfUrl.match(pdfIdRegex);

        if (match && match[1]) {
          const pdfId = "book-pdfs/" + match[1] + ".pdf"; // Prepending 'book-covers/'
          // console.log(pdfId);
          try {
            await cloudinary.uploader.destroy(pdfId, { resource_type: "raw" }); // this resource_type: "raw" is necessary..!
            // deleting coverImage from cloudinary.
          } catch (error) {
            next(createHttpError(500, "Error While Deleting PDF Online"));
            return;
          }
        } else {
          next(
            createHttpError(
              500,
              "Error While Extracting Book Pdf ID :: Not in Proper Format"
            )
          );
          return;
        }
      }

      updatedBookFileURL = bookFileUploadResult.secure_url;
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        next(
          createHttpError(
            500,
            "Error while Deleting Book PDF from Server Local Storage..!"
          )
        );
        return;
      }
    }

    try {
      // console.log("UpdatedBookCoverImgURL", updatedBookCoverImgURL);
      // console.log("updatedBookFileURL", updatedBookFileURL);
      const updatedBookObject = await bookModel.findByIdAndUpdate(
        bookId,
        {
          title: title,
          genre: genre,
          coverImage: updatedBookCoverImgURL,
          file: updatedBookFileURL,
        },
        { new: true } // this will return the updated result to updatedBook constant.
      );

      res.status(200).json({
        message: "Cover Image Updated Successfully",
        updatedBookObject: JSON.parse(JSON.stringify(updatedBookObject)),
      });
      return;
    } catch (error) {
      // console.log(error);
      next(
        createHttpError(500, "Error While Updating Book - findOneAndUpdate")
      );
      return;
    }
    return;
  } catch (error) {
    next(createHttpError(500, "Error While Updating Book"));
    return;
  }
};

export { bookRegister, updateBook };
