import { Request, Response, NextFunction } from "express";
import * as productService from "../service/product.service";

// =========================
// 🛒 CREATE PRODUCT
// =========================
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.createProduct(req.user!, req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// 📦 GET PRODUCTS (LIST + SCROLL)
// =========================
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      size = "10",
      categoryId,
      type,
      minPrice,
      maxPrice,
      search,
      sortBy = "newest",
    } = req.query;

    const result = await productService.getProducts({
      page: Number(page),
      size: Number(size),
      categoryId: categoryId as string | undefined,
      type: type as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search as string | undefined,
      sortBy: sortBy as string,
      user: req.user,
    });

    res.json({
      success: true,
      ...result, // content, page, size, totalPages, last
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// 🔍 GET SINGLE PRODUCT
// =========================
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const product = await productService.getProductById(id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// ✏️ UPDATE PRODUCT
// =========================
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const updated = await productService.updateProduct(req.user!, id, req.body);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// ❌ DELETE PRODUCT
// =========================
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    await productService.deleteProduct(req.user!, id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
