import { Role } from "../../../generated/prisma";
import * as adminRepo from "../admin.repository";
Role;

// =========================
// 🧠 HELPER (ROLE FILTER)
// =========================

const buildRegionFilter = (user: any) => {
  if (user.role === Role.REGIONAL_ADMIN) {
    return { region: user.region };
  }
  return {};
};

// =========================
// 🧠 HELPER (ACCESS CHECK)
// =========================

const assertRegionAccess = (user: any, targetRegion?: string | null) => {
  if (
    user.role === Role.REGIONAL_ADMIN &&
    targetRegion &&
    targetRegion !== user.region
  ) {
    throw new Error("Forbidden");
  }
};

// =========================
// 👥 USERS
// =========================

export const getUsers = async (user: any) => {
  const where = buildRegionFilter(user);
  return adminRepo.findUsers(where);
};

export const getUserById = async (user: any, userId: string) => {
  const target = await adminRepo.findUserById(userId);

  if (!target) throw new Error("User not found");

  assertRegionAccess(user, target.region);

  return target;
};

export const updateUser = async (user: any, userId: string, data: any) => {
  await getUserById(user, userId);
  return adminRepo.updateUser(userId, data);
};

export const deleteUser = async (user: any, userId: string) => {
  await getUserById(user, userId);
  return adminRepo.softDeleteUser(userId);
};

// =========================
// 🛒 SELLERS
// =========================

export const getSellers = async (user: any) => {
  const where = {
    role: Role.SELLER,
    ...buildRegionFilter(user),
  };

  return adminRepo.findUsers(where);
};

export const getSellerById = async (user: any, sellerId: string) => {
  return getUserById(user, sellerId);
};

export const updateSeller = async (user: any, sellerId: string, data: any) => {
  await getSellerById(user, sellerId);
  return adminRepo.updateUser(sellerId, data);
};

// =========================
// 📦 PRODUCTS
// =========================

export const getProducts = async (user: any) => {
  const where = buildRegionFilter(user);
  return adminRepo.findProducts(where);
};

export const updateProduct = async (
  user: any,
  productId: string,
  data: any,
) => {
  const product = await adminRepo.findProductById(productId);

  if (!product) throw new Error("Product not found");

  assertRegionAccess(user, product.region);

  return adminRepo.updateProduct(productId, data);
};

export const deleteProduct = async (user: any, productId: string) => {
  const product = await adminRepo.findProductById(productId);

  if (!product) throw new Error("Product not found");

  assertRegionAccess(user, product.region);

  return adminRepo.deleteProduct(productId);
};

// =========================
// 🧾 ORDERS
// =========================

export const getOrders = async (user: any) => {
  const where = buildRegionFilter(user);
  return adminRepo.findOrders(where);
};

export const getOrderById = async (user: any, orderId: string) => {
  const order = await adminRepo.findOrderById(orderId);

  if (!order) throw new Error("Order not found");

  assertRegionAccess(user, order.region);

  return order;
};

export const updateOrder = async (user: any, orderId: string, data: any) => {
  await getOrderById(user, orderId);
  return adminRepo.updateOrder(orderId, data);
};

// =========================
// 📊 DASHBOARD
// =========================

export const getDashboard = async (user: any) => {
  const where = buildRegionFilter(user);
  return adminRepo.getDashboardStats(where);
};

// =========================
// 💰 ANALYTICS
// =========================

export const getAnalytics = async (user: any) => {
  const where = buildRegionFilter(user);
  return adminRepo.getAnalytics(where);
};

// =========================
// ⚙️ SETTINGS
// =========================

export const getSettings = async (_user: any) => {
  return adminRepo.getSettings();
};

export const updateSettings = async (_user: any, data: any) => {
  return adminRepo.updateSettings(data);
};
