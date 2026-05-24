import { prisma } from "../../database/prisma";

// =========================
// 👥 USERS
// =========================

export const findUsers = (where: any) => {
  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const findUserById = (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

export const updateUser = (userId: string, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const softDeleteUser = (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { status: "DELETED" },
  });
};

// =========================
// 📦 PRODUCTS
// =========================

export const findProducts = (where: any) => {
  return prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const findProductById = (productId: string) => {
  return prisma.product.findUnique({
    where: { id: productId },
  });
};

export const updateProduct = (productId: string, data: any) => {
  return prisma.product.update({
    where: { id: productId },
    data,
  });
};

export const deleteProduct = (productId: string) => {
  return prisma.product.delete({
    where: { id: productId },
  });
};

// =========================
// 🧾 ORDERS
// =========================

export const findOrders = (where: any) => {
  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const findOrderById = (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
  });
};

export const updateOrder = (orderId: string, data: any) => {
  return prisma.order.update({
    where: { id: orderId },
    data,
  });
};

// =========================
// 📊 DASHBOARD
// =========================

export const getDashboardStats = async (where: any) => {
  const [users, products, orders] = await Promise.all([
    prisma.user.count({ where }),
    prisma.product.count({ where }),
    prisma.order.count({ where }),
  ]);

  return {
    totalUsers: users,
    totalProducts: products,
    totalOrders: orders,
  };
};

// =========================
// 💰 ANALYTICS
// =========================

export const getAnalytics = async (where: any) => {
  const orders = await prisma.order.findMany({
    where,
    select: {
      totalAmount: true,
    },
  });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0,
  );

  return {
    totalRevenue,
    totalOrders: orders.length,
  };
};

// =========================
// ⚙️ SETTINGS (SIMPLE)
// =========================

export const getSettings = () => {
  return prisma.settings.findFirst();
};

export const updateSettings = (data: any) => {
  return prisma.settings.update({
    where: { id: 1 }, // simple single-row config
    data,
  });
};
