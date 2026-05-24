import { prisma } from "../../database/prisma";

// =========================
// 🛒 CREATE
// =========================
export const createProduct = (data: any) => {
  return prisma.product.create({
    data,
    include: {
      translations: true,
      media: true,
      inventory: true,
    },
  });
};

// =========================
// 🔍 FIND ONE
// =========================
export const findProductById = (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      translations: true,
      media: true,
      inventory: true,
      analytics: true,
      marketing: true,
      shipping: {
        include: {
          dimensions: true,
        },
      },
      seo: true,
    },
  });
};

// =========================
// 📦 FIND MANY (WITH PAGINATION)
// =========================
export const findProducts = ({
  where,
  skip,
  take,
  orderBy,
}: {
  where: any;
  skip: number;
  take: number;
  orderBy: any;
}) => {
  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy,
    include: {
      translations: true,
      media: true,
      inventory: true,
    },
  });
};

// =========================
// 🔢 COUNT (FOR PAGINATION)
// =========================
export const countProducts = (where: any) => {
  return prisma.product.count({
    where,
  });
};

// =========================
// ✏️ UPDATE
// =========================
export const updateProduct = (id: string, data: any) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

// =========================
// ❌ DELETE
// =========================
export const deleteProduct = (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
