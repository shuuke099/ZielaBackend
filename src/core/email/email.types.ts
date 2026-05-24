/* =========================
   📧 EMAIL TYPES
========================= */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/* =========================
   📩 TEMPLATE DATA TYPES
========================= */

export interface VerifyEmailTemplateData {
  name?: string;
  url: string;
}

export interface ResetPasswordTemplateData {
  name?: string;
  url: string;
}
