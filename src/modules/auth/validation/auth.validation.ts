import { z } from "zod";

// 🔐 REGISTER
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number"),

  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
});

// 🔐 LOGIN
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// 🔐 CHANGE PASSWORD
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),

  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(32)
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[0-9]/, "Must include number"),
});
