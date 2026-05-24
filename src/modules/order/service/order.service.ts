import { prisma } from "../../../database/prisma";
import { Role, OrderStatus } from "../../../generated/prisma";

type AuthUser = {
  userId: string;
  role: Role;
  region?: string | null;
};

type PaginationParams = {
  page: number;
  size: number;
};

type GetOrdersParams = PaginationParams & {
  user: AuthUser;
  status?: string;
  userId?: string;
};

// =========================
// 🛒 CREATE ORDER (CHECKOUT)
// =========================
export const createOrder = async (user: AuthUser, data: any) => {
  if (user.role !== Role.BUYER) {
    throw new Error("Only buyers can create orders");
  }

  const { items } = data; // [{ productId, quantity }]

  if (!items || items.length === 0) {
    throw new Error("Order items required");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    // 🔍 Validate + calculate
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { inventory: true },
        });

        if (!product) throw new Error("Product not found");

        if (!product.inventory || product.inventory.quantity < item.quantity) {
          throw new Error("Insufficient stock");
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    // 🧾 Create order
    const order = await tx.order.create({
      data: {
        userId: user.userId,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // 📦 Reduce stock
    await Promise.all(
      orderItems.map((item) =>
        tx.productInventory.update({
          where: { productId: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    return order;
  });
};

// =========================
// 👤 GET MY ORDERS (BUYER)
// =========================
export const getMyOrders = async ({
  user,
  page,
  size,
}: {
  user: AuthUser;
  page: number;
  size: number;
}) => {
  const skip = (page - 1) * size;
  const take = size;

  const where = {
    userId: user.userId,
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    content: orders,
    page,
    size,
    totalPages: Math.ceil(total / size),
    totalElements: total,
    last: page * size >= total,
  };
};

// =========================
// 👑 GET ALL ORDERS
// =========================
export const getOrders = async ({
  user,
  page,
  size,
  status,
  userId,
}: GetOrdersParams) => {
  const skip = (page - 1) * size;
  const take = size;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (userId) {
    where.userId = userId;
  }

  // 🌍 REGION FILTER
  if (user.role === Role.REGIONAL_ADMIN) {
    where.region = user.region;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    content: orders,
    page,
    size,
    totalPages: Math.ceil(total / size),
    totalElements: total,
    last: page * size >= total,
  };
};

// =========================
// 🔍 GET ORDER BY ID
// =========================
export const getOrderById = async (user: AuthUser, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new Error("Order not found");

  // 🔐 Ownership / admin check
  if (
    order.userId !== user.userId &&
    user.role !== Role.MANAGER &&
    user.role !== Role.SUPER_ADMIN &&
    user.role !== Role.REGIONAL_ADMIN
  ) {
    throw new Error("Forbidden");
  }

  return order;
};

// =========================
// ✏️ UPDATE ORDER STATUS
// =========================
export const updateOrder = async (
  user: AuthUser,
  orderId: string,
  data: any,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");

  if (
    user.role !== Role.MANAGER &&
    user.role !== Role.SUPER_ADMIN &&
    user.role !== Role.REGIONAL_ADMIN
  ) {
    throw new Error("Forbidden");
  }

  return prisma.order.update({
    where: { id: orderId },
    data,
  });
};
