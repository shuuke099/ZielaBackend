import * as sellerRepo from "../seller.repository";
import * as userRepo from "../../user/user.repository";

// =========================
// 👤 SELLER PROFILE
// =========================

export const getProfile = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user || user.role !== "SELLER") {
    throw new Error("Seller not found");
  }

  return user;
};

export const updateProfile = async (userId: string, data: any) => {
  const user = await userRepo.findById(userId);

  if (!user || user.role !== "SELLER") {
    throw new Error("Seller not found");
  }

  return sellerRepo.updateSeller(userId, {
    companyName: data.companyName,
    phoneNumber: data.phoneNumber,
    logoUrl: data.logoUrl,
    region: data.region,
  });
};

export const deleteProfile = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user || user.role !== "SELLER") {
    throw new Error("Seller not found");
  }

  // optional: downgrade role or just deactivate business fields
  return sellerRepo.updateSeller(userId, {
    companyName: null,
    logoUrl: null,
  });
};

// =========================
// 📊 DASHBOARD
// =========================

export const getDashboard = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user || user.role !== "SELLER") {
    throw new Error("Unauthorized");
  }

  const productsCount = await sellerRepo.countProducts(userId);

  return {
    productsCount,
    rating: user.rating,
  };
};

// =========================
// 📦 PRODUCTS (OWNER)
// =========================

export const getMyProducts = async (userId: string) => {
  return sellerRepo.getProductsBySeller(userId);
};

export const createProduct = async (userId: string, data: any) => {
  return sellerRepo.createProduct(userId, data);
};

export const updateProduct = async (
  userId: string,
  productId: string,
  data: any,
) => {
  const product = await sellerRepo.findProductById(productId);

  if (!product || product.sellerId !== userId) {
    throw new Error("Product not found or unauthorized");
  }

  return sellerRepo.updateProduct(productId, data);
};

export const deleteProduct = async (userId: string, productId: string) => {
  const product = await sellerRepo.findProductById(productId);

  if (!product || product.sellerId !== userId) {
    throw new Error("Product not found or unauthorized");
  }

  return sellerRepo.deleteProduct(productId);
};

// =========================
// 🌍 PUBLIC SELLER
// =========================

export const getPublicSeller = async (sellerId: string) => {
  const seller = await sellerRepo.findPublicSeller(sellerId);

  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller;
};
