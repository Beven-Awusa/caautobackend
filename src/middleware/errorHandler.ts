import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { ResponseHandler } from "../utils/response";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // If response was already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(error);
  }

  // Log error for debugging
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle custom AppError instances
  if (error instanceof AppError) {
    return ResponseHandler.error(
      res,
      error.message,
      error.statusCode,
      process.env.NODE_ENV === "development" ? error.stack : undefined
    );
  }

  // Handle Zod validation errors
  if (error.name === "ZodError") {
    const zodError = error as any;
    const errorMessages = zodError.errors
      .map((err: any) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");

    return ResponseHandler.badRequest(res, "Validation failed", errorMessages);
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return ResponseHandler.unauthorized(res, "Invalid token");
  }

  if (error.name === "TokenExpiredError") {
    return ResponseHandler.unauthorized(res, "Token expired");
  }

  // Handle Multer errors
  if (error.name === "MulterError") {
    const multerError = error as any;
    switch (multerError.code) {
      case "LIMIT_FILE_SIZE":
        return ResponseHandler.badRequest(res, "File too large");
      case "LIMIT_FILE_COUNT":
        return ResponseHandler.badRequest(res, "Too many files");
      case "LIMIT_UNEXPECTED_FILE":
        return ResponseHandler.badRequest(res, "Unexpected file field");
      default:
        return ResponseHandler.badRequest(res, "File upload error");
    }
  }

  // Handle other common errors
  if (error.name === "CastError") {
    return ResponseHandler.badRequest(res, "Invalid ID format");
  }

  if (error.name === "ValidationError") {
    return ResponseHandler.badRequest(res, "Validation error", error.message);
  }

  // Default to internal server error
  return ResponseHandler.internalServerError(
    res,
    "Something went wrong",
    process.env.NODE_ENV === "development" ? error.message : undefined
  );
};

// 404 handler for unmatched routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return ResponseHandler.notFound(res, `Route ${req.originalUrl} not found`);
};
