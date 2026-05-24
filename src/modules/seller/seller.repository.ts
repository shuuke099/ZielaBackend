import { prisma } from "../../database/prisma";

// =========================
// 👤 SELLER PROFILE
// =========================

export const updateSeller = (userId: string, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

// =========================
// 📊 DASHBOARD
// =========================

export const countProducts = (sellerId: string) => {
  return prisma.product.count({
    where: { sellerId },
  });
};

// =========================
// 📦 PRODUCTS (OWNER)
// =========================

export const getProductsBySeller = (sellerId: string) => {
  return prisma.product.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });
};

export const findProductById = (productId: string) => {
  return prisma.product.findUnique({
    where: { id: productId },
  });
};

export const createProduct = (sellerId: string, data: any) => {
  return prisma.product.create({
    data: {
      ...data,
      sellerId,
    },
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
// 🌍 PUBLIC SELLER
// =========================

export const findPublicSeller = (sellerId: string) => {
  return prisma.user.findUnique({
    where: { id: sellerId },
    select: {
      id: true,
      companyName: true,
      logoUrl: true,
      rating: true,
      region: true,
      productsCount: true,
    },
  });
};
