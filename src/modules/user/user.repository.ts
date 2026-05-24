import { prisma } from "../../database/prisma";

// =========================
// 👤 BASIC QUERIES
// =========================

export const findById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const updateById = (id: string, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

// =========================
// 🌍 PUBLIC USER
// =========================

export const findPublicById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      rating: true,
      region: true,
      productsCount: true,
    },
  });
};

export const upgradeToSeller = (userId: string, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role: "SELLER",
      companyName: data.companyName,
      phoneNumber: data.phoneNumber,
    },
  });
};
