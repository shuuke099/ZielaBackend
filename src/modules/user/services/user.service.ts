import * as userRepo from "../user.repository";

// =========================
// 👤 USER PROFILE (SELF)
// =========================

export const getCurrentUser = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user || user.status === "DELETED") {
    throw new Error("User not found");
  }

  return user;
};

export const updateUser = async (userId: string, data: any) => {
  const user = await userRepo.findById(userId);

  if (!user || user.status === "DELETED") {
    throw new Error("User not found");
  }

  // ✅ allow only safe fields
  const updateData: any = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
  if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

  return userRepo.updateById(userId, updateData);
};

export const deleteUser = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user || user.status === "DELETED") {
    throw new Error("User not found");
  }

  // ✅ soft delete
  return userRepo.updateById(userId, {
    status: "DELETED",
  });
};

// =========================
// 🖼 AVATAR MANAGEMENT
// =========================

export const updateAvatar = async (userId: string, avatarUrl: string) => {
  if (!avatarUrl) {
    throw new Error("Avatar URL is required");
  }

  return userRepo.updateById(userId, {
    avatarUrl,
  });
};

export const getAvatar = async (userId: string) => {
  const user = await userRepo.findById(userId);

  if (!user || user.status === "DELETED") {
    throw new Error("User not found");
  }

  return user.avatarUrl;
};

export const deleteAvatar = async (userId: string) => {
  return userRepo.updateById(userId, {
    avatarUrl: null,
  });
};

// =========================
// 🌍 PUBLIC USER
// =========================

export const getPublicUser = async (userId: string) => {
  const user = await userRepo.findPublicById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const upgradeToSeller = async (userId: string, data: any) => {
  const user = await userRepo.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "SELLER") {
    throw new Error("User is already a seller");
  }

  return userRepo.upgradeToSeller(userId, data);
};
