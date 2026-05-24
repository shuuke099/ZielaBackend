import { Request, Response } from "express";
import * as userService from "../services/user.service";

// =========================
// 👤 USER PROFILE (SELF)
// =========================

// GET /users/me
export const getMe = async (req: Request, res: Response) => {
  const user = await userService.getCurrentUser(req.user!.userId);

  res.json({
    success: true,
    data: user,
  });
};

// PATCH /users/me
export const updateMe = async (req: Request, res: Response) => {
  const updatedUser = await userService.updateUser(req.user!.userId, req.body);

  res.json({
    success: true,
    data: updatedUser,
  });
};

// DELETE /users/me
export const deleteMe = async (req: Request, res: Response) => {
  await userService.deleteUser(req.user!.userId);

  res.json({
    success: true,
    message: "User account deleted successfully",
  });
};

// =========================
// 🖼 AVATAR
// =========================

export const uploadAvatar = async (req: Request, res: Response) => {
  const avatarUrl = req.body.avatarUrl;

  const updatedUser = await userService.updateAvatar(
    req.user!.userId,
    avatarUrl,
  );

  res.json({
    success: true,
    data: updatedUser,
  });
};

export const getAvatar = async (req: Request, res: Response) => {
  const avatar = await userService.getAvatar(req.user!.userId);

  res.json({
    success: true,
    data: { avatarUrl: avatar },
  });
};

export const deleteAvatar = async (req: Request, res: Response) => {
  await userService.deleteAvatar(req.user!.userId);

  res.json({
    success: true,
    message: "Avatar removed",
  });
};

// =========================
// 🌍 PUBLIC USER
// =========================

export const getPublicUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const user = await userService.getPublicUser(userId);

  res.json({
    success: true,
    data: user,
  });
};
export const upgradeToSeller = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const updatedUser = await userService.upgradeToSeller(userId, req.body);

  res.json({
    success: true,
    data: updatedUser,
  });
};
