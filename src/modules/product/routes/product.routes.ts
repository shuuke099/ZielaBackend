import { Router } from "express";
import * as productController from "../controller/product.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

// =========================
// 🌍 PUBLIC ROUTES
// =========================

// GET /products (list + infinite scroll)
router.get("/", productController.getProducts);

// GET /products/:id (single product)
router.get("/:id", productController.getProductById);

// =========================
// 🔐 PROTECTED ROUTES
// =========================

// POST /products (create)
router.post("/", authMiddleware, productController.createProduct);

// PATCH /products/:id (update)
router.patch("/:id", authMiddleware, productController.updateProduct);

// DELETE /products/:id (delete)
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
