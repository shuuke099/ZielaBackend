import { prisma } from "../../database/prisma";

// =========================
// 🛒 CREATE ORDER (WITH TX)
// =========================
export const createOrder = (tx: any, data: any) => {
  return tx.order.create({
    data,
    include: {
      items: true,
    },
  });
};

// =========================
// 🔍 FIND PRODUCT (FOR CHECKOUT)
// =========================
export const findProductById = (tx: any, productId: string) => {
  return tx.product.findUnique({
    where: { id: productId },
    include: {
      inventory: true,
    },
  });
};

// =========================
// 📦 UPDATE STOCK
// =========================
export const decrementStock = (
  tx: any,
  productId: string,
  quantity: number,
) => {
  return tx.productInventory.update({
    where: { productId },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });
};

// =========================
// 📦 FIND ORDERS (LIST)
// =========================
export const findOrders = ({
  where,
  skip,
  take,
}: {
  where: any;
  skip: number;
  take: number;
}) => {
  return prisma.order.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });
};

// =========================
// 🔢 COUNT ORDERS
// =========================
export const countOrders = (where: any) => {
  return prisma.order.count({
    where,
  });
};

// =========================
// 🔍 FIND ONE ORDER
// =========================
export const findOrderById = (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });
};

// =========================
// ✏️ UPDATE ORDER
// =========================
export const updateOrder = (orderId: string, data: any) => {
  return prisma.order.update({
    where: { id: orderId },
    data,
  });
};
