import nodemailer from "nodemailer";
import { SendEmailOptions } from "./email.types";
import { verifyEmailTemplate } from "./templates/verify-email.template";
import { resetPasswordTemplate } from "./templates/reset-password.template";

class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail(options: SendEmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: `"ZeilaHub" <${process.env.EMAIL_FROM}>`,
      ...options,
    });
  }

  /* =========================
     📧 VERIFY EMAIL
  ========================= */

  async sendVerificationEmail(email: string, token: string, name?: string) {
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const html = verifyEmailTemplate({ name, url });

    await this.sendEmail({
      to: email,
      subject: "Verify your email",
      html,
    });
  }

  /* =========================
     🔑 RESET PASSWORD
  ========================= */

  async sendResetPasswordEmail(email: string, token: string, name?: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = resetPasswordTemplate({ name, url });

    await this.sendEmail({
      to: email,
      subject: "Reset your password",
      html,
    });
  }
}

export const emailService = new EmailService();
