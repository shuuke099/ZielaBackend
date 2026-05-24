import { Router } from "express";
import * as orderController from "../controller/order.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

// =========================
// 🔐 USER (BUYER)
// =========================

// Create order (checkout)
router.post("/", authMiddleware, orderController.createOrder);

// Get my orders
router.get("/me", authMiddleware, orderController.getMyOrders);

// =========================
// 🔐 ADMIN / SELLER
// =========================

// Get all orders (admin / regional)
router.get("/", authMiddleware, orderController.getOrders);

// Get single order
router.get("/:id", authMiddleware, orderController.getOrderById);

// Update order (status)
router.patch("/:id", authMiddleware, orderController.updateOrder);

export default router;
