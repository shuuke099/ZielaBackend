import { Request, Response } from "express";
import * as adminService from "../service/admin.service";

// =========================
// 👥 USERS
// =========================

// GET /admin/users
export const getUsers = async (req: Request, res: Response) => {
  const users = await adminService.getUsers(req.user!);

  res.json({
    success: true,
    data: users,
  });
};

// GET /admin/users/:userId
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const user = await adminService.getUserById(req.user!, userId);

  res.json({
    success: true,
    data: user,
  });
};

// PATCH /admin/users/:userId
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const updated = await adminService.updateUser(req.user!, userId, req.body);

  res.json({
    success: true,
    data: updated,
  });
};

// DELETE /admin/users/:userId
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  await adminService.deleteUser(req.user!, userId);

  res.json({
    success: true,
    message: "User deleted",
  });
};

// =========================
// 🛒 SELLERS
// =========================

// GET /admin/sellers
export const getSellers = async (req: Request, res: Response) => {
  const sellers = await adminService.getSellers(req.user!);

  res.json({
    success: true,
    data: sellers,
  });
};

// GET /admin/sellers/:sellerId
export const getSellerById = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId as string;

  const seller = await adminService.getSellerById(req.user!, sellerId);

  res.json({
    success: true,
    data: seller,
  });
};

// PATCH /admin/sellers/:sellerId
export const updateSeller = async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId as string;

  const updated = await adminService.updateSeller(
    req.user!,
    sellerId,
    req.body,
  );

  res.json({
    success: true,
    data: updated,
  });
};

// =========================
// 📦 PRODUCTS
// =========================

// GET /admin/products
export const getProducts = async (req: Request, res: Response) => {
  const products = await adminService.getProducts(req.user!);

  res.json({
    success: true,
    data: products,
  });
};

// PATCH /admin/products/:productId
export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;

  const updated = await adminService.updateProduct(
    req.user!,
    productId,
    req.body,
  );

  res.json({
    success: true,
    data: updated,
  });
};

// DELETE /admin/products/:productId
export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId as string;

  await adminService.deleteProduct(req.user!, productId);

  res.json({
    success: true,
    message: "Product deleted",
  });
};

// =========================
// 🧾 ORDERS
// =========================

// GET /admin/orders
export const getOrders = async (req: Request, res: Response) => {
  const orders = await adminService.getOrders(req.user!);

  res.json({
    success: true,
    data: orders,
  });
};

// GET /admin/orders/:orderId
export const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;

  const order = await adminService.getOrderById(req.user!, orderId);

  res.json({
    success: true,
    data: order,
  });
};

// PATCH /admin/orders/:orderId
export const updateOrder = async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;

  const updated = await adminService.updateOrder(req.user!, orderId, req.body);

  res.json({
    success: true,
    data: updated,
  });
};

// =========================
// 📊 DASHBOARD
// =========================

// GET /admin/dashboard
export const getDashboard = async (req: Request, res: Response) => {
  const dashboard = await adminService.getDashboard(req.user!);

  res.json({
    success: true,
    data: dashboard,
  });
};

// =========================
// 💰 ANALYTICS
// =========================

// GET /admin/analytics
export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await adminService.getAnalytics(req.user!);

  res.json({
    success: true,
    data: analytics,
  });
};

// =========================
// ⚙️ SETTINGS
// =========================

// GET /admin/settings
export const getSettings = async (req: Request, res: Response) => {
  const settings = await adminService.getSettings(req.user!);

  res.json({
    success: true,
    data: settings,
  });
};

// PATCH /admin/settings
export const updateSettings = async (req: Request, res: Response) => {
  const updated = await adminService.updateSettings(req.user!, req.body);

  res.json({
    success: true,
    data: updated,
  });
};
