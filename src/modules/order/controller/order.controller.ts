import { Request, Response, NextFunction } from "express";
import * as orderService from "../service/order.service";

// =========================
// 🛒 CREATE ORDER (CHECKOUT)
// =========================
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await orderService.createOrder(req.user!, req.body);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// 👤 GET MY ORDERS (BUYER)
// =========================
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = "1", size = "10" } = req.query;

    const result = await orderService.getMyOrders({
      user: req.user!, // ✅ FIXED
      page: Number(page),
      size: Number(size),
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// 👑 GET ALL ORDERS (ADMIN / SELLER)
// =========================
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = "1", size = "10", status, userId } = req.query;

    const result = await orderService.getOrders({
      user: req.user!, // ✅ FIXED
      page: Number(page),
      size: Number(size),
      status: status as string | undefined,
      userId: userId as string | undefined,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// 🔍 GET ORDER BY ID
// =========================
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // ✅ FIXED

    const order = await orderService.getOrderById(req.user!, id); // ✅ FIXED

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// ✏️ UPDATE ORDER (STATUS)
// =========================
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string }; // ✅ FIXED

    const updated = await orderService.updateOrder(
      req.user!, // ✅ FIXED
      id,
      req.body,
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
