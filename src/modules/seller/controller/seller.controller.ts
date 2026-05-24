import { Request, Response } from "express";
import * as sellerService from "../service/seller.service";

// =========================
// 👤 SELLER PROFILE (SELF)
// =========================

// GET /seller/profile
export const getProfile = async (req: Request, res: Response) => {
  const seller = await sellerService.getProfile(req.user!.userId);

  res.json({
    success: true,
    data: seller,
  });
};

// PATCH /seller/profile
export const updateProfile = async (req: Request, res: Response) => {
  const updated = await sellerService.updateProfile(req.user!.userId, req.body);

  res.json({
    success: true,
    data: updated,
  });
};

// DELETE /seller/profile
export const deleteProfile = async (req: Request, res: Response) => {
  await sellerService.deleteProfile(req.user!.userId);

  res.json({
    success: true,
    message: "Seller profile deactivated",
  });
};

// =========================
// 📊 SELLER DASHBOARD
// =========================

// GET /seller/dashboard
export const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await sellerService.getDashboard(req.user!.userId);

  res.json({
    success: true,
    data: dashboard,
  });
};

// =========================
// 📦 SELLER PRODUCTS
// =========================

// GET /seller/products
export const getMyProducts = async (req: Request, res: Response) => {
  const products = await sellerService.getMyProducts(req.user!.userId);

  res.json({
    success: true,
    data: products,
  });
};

// POST /seller/products
export const createProduct = async (req: Request, res: Response) => {
  const product = await sellerService.createProduct(req.user!.userId, req.body);

  res.json({
    success: true,
    data: product,
  });
};

// PATCH /seller/products/:productId
export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;

  const updated = await sellerService.updateProduct(
    req.user!.userId,
    productId,
    req.body,
  );

  res.json({
    success: true,
    data: updated,
  });
};

// DELETE /seller/products/:productId
export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;

  await sellerService.deleteProduct(req.user!.userId, productId);

  res.json({
    success: true,
    message: "Product deleted",
  });
};

// =========================
// 🌍 PUBLIC SELLER
// =========================

// GET /sellers/:sellerId
export const getPublicSeller = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId as string;

  const seller = await sellerService.getPublicSeller(sellerId);

  res.json({
    success: true,
    data: seller,
  });
};
