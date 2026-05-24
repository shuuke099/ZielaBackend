import { Request, Response, NextFunction } from "express";
import { AppError } from "../core/error-handler";
import { logger } from "../core/logger";
import { HTTP_STATUS } from "../core/http-status";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Normalize error
  const message = err?.message || "Unknown error occurred";

  // Log error
  logger.error(message, err?.stack);

  // Known (operational) error
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Unknown error (programming / system error)
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "Something went wrong" : message,
    timestamp: new Date().toISOString(),
  });
};
