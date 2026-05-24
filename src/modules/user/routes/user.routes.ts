import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
authMiddleware;

const router = Router();

// =========================
// 👤 USER PROFILE (SELF)
// =========================

router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);
router.delete("/me", authMiddleware, userController.deleteMe);

// =========================
// 🖼 AVATAR MANAGEMENT
// =========================

router.post("/me/avatar", authMiddleware, userController.uploadAvatar);
router.get("/me/avatar", authMiddleware, userController.getAvatar);
router.delete("/me/avatar", authMiddleware, userController.deleteAvatar);
router.post(
  "/upgrade-to-seller",
  authMiddleware,
  userController.upgradeToSeller,
);
// =========================
// 🌍 PUBLIC USER
// =========================

router.get("/:userId", userController.getPublicUser);

export default router;
