import { Router } from "express";
import * as sellerController from "../controller/seller.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

// =========================
// 👤 SELLER PROFILE
// =========================

router.get("/profile", authMiddleware, sellerController.getProfile);
router.patch("/profile", authMiddleware, sellerController.updateProfile);
router.delete("/profile", authMiddleware, sellerController.deleteProfile);

// =========================
// 📊 DASHBOARD
// =========================

router.get("/dashboard", authMiddleware, sellerController.getDashboard);

// =========================
// 📦 PRODUCTS (OWNER)
// =========================

router.get("/products", authMiddleware, sellerController.getMyProducts);
router.post("/products", authMiddleware, sellerController.createProduct);
router.patch(
  "/products/:productId",
  authMiddleware,
  sellerController.updateProduct,
);
router.delete(
  "/products/:productId",
  authMiddleware,
  sellerController.deleteProduct,
);

// =========================
// 🌍 PUBLIC SELLER
// =========================

router.get("/:sellerId", sellerController.getPublicSeller);

export default router;
