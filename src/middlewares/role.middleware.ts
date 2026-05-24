import { Request, Response, NextFunction } from "express";
import { AppError } from "../core/error-handler";
import { HTTP_STATUS } from "../core/http-status";

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // ❗ must have authMiddleware before this
    if (!req.user) {
      return next(new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED));
    }

    // ❗ check role
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", HTTP_STATUS.FORBIDDEN));
    }

    next();
  };
};
