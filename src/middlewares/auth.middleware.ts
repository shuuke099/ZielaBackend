import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AppError } from "../core/error-handler";
import { HTTP_STATUS } from "../core/http-status";
import { env } from "../config/env";
import { Role } from "../generated/prisma";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      userId: string;
      role: string;
      region?: string;
    };

    // 3. Attach user to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role as Role, // ✅ CRITICAL FIX
      region: decoded.region,
    };

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", HTTP_STATUS.UNAUTHORIZED));
  }
};
