import { Request, Response, NextFunction } from "express";

import { HTTP_STATUS } from "../../../core/http-status";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../../../core/api-response";
import { Role } from "../../../generated/prisma";

/* =========================
   🧠 TYPES
========================= */

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        region?: string | null;
      };
    }
  }
}

/* =========================
   🎯 CONTROLLER
========================= */

export class AuthController {
  /* =========================
     🔐 AUTH
  ========================= */

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);

      return res
        .status(HTTP_STATUS.CREATED)
        .json(ApiResponse.success(result, "User registered successfully"));
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);

      // 🔒 Store refreshToken in HttpOnly cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      // ❌ Remove refreshToken from response (important)
      const { refreshToken, ...safeData } = result;

      // ✅ Keep your ApiResponse style
      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(safeData, "Login successful"));
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ApiResponse.error("Refresh token is required"));
      }

      const result = await authService.refreshToken(refreshToken);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "Token refreshed"));
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(null, "Logged out successfully"));
    } catch (error) {
      next(error);
    }
  };

  /* =========================
     📧 EMAIL
  ========================= */

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ApiResponse.error("Verification token is required"));
      }

      const result = await authService.verifyEmail(token);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "Email verified"));
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ApiResponse.error("Email is required"));
      }

      const result = await authService.resendVerification(email);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "Verification email sent"));
    } catch (error) {
      next(error);
    }
  };

  /* =========================
     🔑 PASSWORD
  ========================= */

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(ApiResponse.error("Email is required"));
      }

      const result = await authService.forgotPassword(email);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "Reset email sent"));
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.resetPassword(req.body);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "Password reset successful"));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json(ApiResponse.error("Unauthorized"));
      }

      const result = await authService.changePassword(userId, req.body);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "Password changed"));
    } catch (error) {
      next(error);
    }
  };

  /* =========================
     👤 USER
  ========================= */

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json(ApiResponse.error("Unauthorized"));
      }

      const result = await authService.getMe(userId);

      return res
        .status(HTTP_STATUS.OK)
        .json(ApiResponse.success(result, "User fetched"));
    } catch (error) {
      next(error);
    }
  };
}

/* =========================
   ✅ SINGLETON
========================= */

export const authController = new AuthController();
