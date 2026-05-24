import * as productRepo from "../product.repository";
import { Role, ProductStatus, ProductType } from "../../../generated/prisma";

type AuthUser = {
  userId: string;
  role: Role;
  region?: string | null;
};

type GetProductsParams = {
  page: number;
  size: number;
  categoryId?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  user?: AuthUser;
};

// =========================
// 🛒 CREATE PRODUCT
// =========================
export const createProduct = async (user: AuthUser, data: any) => {
  if (user.role !== Role.SELLER) {
    throw new Error("Only sellers can create products");
  }

  return productRepo.createProduct({
    ...data,
    sellerId: user.userId,
    status: ProductStatus.DRAFT,
  });
};

// =========================
// 📦 GET PRODUCTS (CORE)
// =========================
export const getProducts = async (params: GetProductsParams) => {
  const {
    page,
    size,
    categoryId,
    type,
    minPrice,
    maxPrice,
    search,
    sortBy,
    user,
  } = params;

  const skip = (page - 1) * size;
  const take = size;

  // =========================
  // FILTERS
  // =========================
  const where: any = {
    status: ProductStatus.ACTIVE,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (type) {
    where.type = type as ProductType;
  }

  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice && { gte: minPrice }),
      ...(maxPrice && { lte: maxPrice }),
    };
  }

  // 🔍 SEARCH (translations)
  if (search) {
    where.translations = {
      some: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    };
  }

  // 🌍 REGION FILTER
  if (user?.role === Role.REGIONAL_ADMIN) {
    where.region = user.region;
  }

  // =========================
  // SORTING
  // =========================
  let orderBy: any = { createdAt: "desc" };

  switch (sortBy) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  // =========================
  // QUERY
  // =========================
  const [products, total] = await Promise.all([
    productRepo.findProducts({
      where,
      skip,
      take,
      orderBy,
    }),
    productRepo.countProducts(where),
  ]);

  const totalPages = Math.ceil(total / size);

  return {
    content: products,
    page,
    size,
    totalPages,
    totalElements: total,
    last: page >= totalPages,
  };
};

// =========================
// 🔍 GET SINGLE PRODUCT
// =========================
export const getProductById = async (id: string) => {
  const product = await productRepo.findProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// =========================
// ✏️ UPDATE PRODUCT
// =========================
export const updateProduct = async (
  user: AuthUser,
  productId: string,
  data: any,
) => {
  const product = await productRepo.findProductById(productId);

  if (!product) throw new Error("Product not found");

  if (
    product.sellerId !== user.userId &&
    user.role !== Role.MANAGER &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new Error("Forbidden");
  }

  return productRepo.updateProduct(productId, data);
};

// =========================
// ❌ DELETE PRODUCT
// =========================
export const deleteProduct = async (user: AuthUser, productId: string) => {
  const product = await productRepo.findProductById(productId);

  if (!product) throw new Error("Product not found");

  if (
    product.sellerId !== user.userId &&
    user.role !== Role.MANAGER &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new Error("Forbidden");
  }

  return productRepo.deleteProduct(productId);
};
