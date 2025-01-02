// Global Error Handler Middlware
import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

/**
 * Global error handling middleware for the application.
 * Catches errors thrown by other routes and sends an appropriate response.
 * 
 * @param {HttpError} err - The error object, which includes a message, stack trace, and optional status code.
 * @param {Request} req - The incoming HTTP request (not used directly in this function).
 * @param {Response} res - The outgoing HTTP response, which will contain the error message and stack trace.
 * @param {NextFunction} next - The next middleware function, not used in this case.
 * 
 * @returns {void} Sends a JSON response with the error message and stack trace (in development environment).
 */
const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    errorStack: config.node_env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
