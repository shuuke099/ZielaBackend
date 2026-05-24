import bcrypt from "bcrypt";
import crypto from "crypto";
import { AppError } from "../../../core/error-handler";
import { HTTP_STATUS } from "../../../core/http-status";
import { userRepository } from "../repository";
import { tokenService } from "../../../core/ security/token.service";
/* =========================
   🧠 TYPES
========================= */

interface AuthPayload {
  userId: string;
  role: string;
}

export class AuthService {
  /* =========================
     🔐 REGISTER
  ========================= */

  async register(data: any) {
    const { email, password, firstName, lastName } = data;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already registered", HTTP_STATUS.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "BUYER",
      verified: false,
    });

    const token = this.generateEmailToken();

    await userRepository.update(user.id, {
      verificationToken: token,
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await sendVerificationEmail(user.email, token);

    // ✅ DO NOT LOGIN USER
    return {
      message: "Registration successful. Please verify your email.",
    };
  }

  /* =========================
     🔐 LOGIN
  ========================= */

  async login(data: any) {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED);
    }

    return this.generateAuthResponse(user);
  }

  /* =========================
     🔄 REFRESH TOKEN (JWT ONLY)
  ========================= */

  async refreshToken(token: string) {
    let payload: AuthPayload;

    try {
      payload = tokenService.verifyRefreshToken(token);
    } catch {
      throw new AppError("Invalid refresh token", HTTP_STATUS.UNAUTHORIZED);
    }

    const newAccessToken = tokenService.generateAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    return { accessToken: newAccessToken };
  }

  /* =========================
     🔓 LOGOUT
  ========================= */

  async logout() {
    // Stateless JWT → logout handled on client side
    return { message: "Logged out successfully" };
  }

  /* =========================
     📧 EMAIL (placeholder)
  ========================= */

  async verifyEmail(token: string) {
    return { message: "Email verified (placeholder)" };
  }

  async resendVerification(email: string) {
    return { message: "Verification email sent (placeholder)" };
  }

  /* =========================
     🔑 PASSWORD
  ========================= */

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    return { message: "Reset link sent (placeholder)" };
  }

  async resetPassword(data: any) {
    const { userId, newPassword } = data;

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await userRepository.update(userId, {
      password: hashedPassword,
    });

    return { message: "Password reset successful" };
  }

  async changePassword(userId: string, data: any) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(data.currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Incorrect password", HTTP_STATUS.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    await userRepository.update(userId, {
      password: hashedPassword,
    });

    return { message: "Password updated" };
  }

  /* =========================
     👤 USER
  ========================= */

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    return this.sanitizeUser(user);
  }

  /* =========================
     🧠 HELPERS
  ========================= */

  private generateAuthResponse(user: any) {
    const payload: AuthPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }
  private generateEmailToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}

export const authService = new AuthService();
