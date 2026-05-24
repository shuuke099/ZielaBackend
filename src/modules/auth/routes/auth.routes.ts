import { Router } from "express";

import { validate } from "../../../middlewares/validation.middleware";
import { authLimiter } from "../../../middlewares/rate-limit.middleware";
import { authMiddleware } from "../../../middlewares/auth.middleware";

import { authController } from "../controllers/auth.controller";

import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../validation/auth.validation";

const router = Router();

/* =========================
   🔐 AUTH ROUTES
========================= */

// REGISTER
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);

// LOGIN
router.post("/login", authLimiter, validate(loginSchema), authController.login);

// REFRESH TOKEN
router.post("/refresh-token", authController.refreshToken);

// LOGOUT
router.post("/logout", authController.logout);

/* =========================
   📧 EMAIL VERIFICATION
========================= */

router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);

/* =========================
   🔑 PASSWORD
========================= */

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// CHANGE PASSWORD (AUTH REQUIRED)
router.put(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword,
);

/* =========================
   👤 USER SESSION
========================= */

// GET CURRENT USER
router.get("/me", authMiddleware, authController.getMe);

export default router;
