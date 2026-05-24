import { Router } from "express";
import * as adminController from "../controller/admin.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { requireRole } from "../../../middlewares/role.middleware";

const router = Router();

// 🔐 All admin routes protected
router.use(
  authMiddleware,
  requireRole("ADMIN", "REGIONAL_ADMIN", "SUPER_ADMIN"),
);

// =========================
// 👥 USERS
// =========================

router.get("/users", adminController.getUsers);
router.get("/users/:userId", adminController.getUserById);
router.patch("/users/:userId", adminController.updateUser);
router.delete("/users/:userId", adminController.deleteUser);

// =========================
// 🛒 SELLERS
// =========================

router.get("/sellers", adminController.getSellers);
router.get("/sellers/:sellerId", adminController.getSellerById);
router.patch("/sellers/:sellerId", adminController.updateSeller);

// =========================
// 📦 PRODUCTS
// =========================

router.get("/products", adminController.getProducts);
router.patch("/products/:productId", adminController.updateProduct);
router.delete("/products/:productId", adminController.deleteProduct);

// =========================
// 🧾 ORDERS
// =========================

router.get("/orders", adminController.getOrders);
router.get("/orders/:orderId", adminController.getOrderById);
router.patch("/orders/:orderId", adminController.updateOrder);

// =========================
// 📊 DASHBOARD
// =========================

router.get("/dashboard", adminController.getDashboard);

// =========================
// 💰 ANALYTICS
// =========================

router.get("/analytics", adminController.getAnalytics);

// =========================
// ⚙️ SETTINGS
// =========================

router.get("/settings", adminController.getSettings);
router.patch("/settings", adminController.updateSettings);

export default router;
