import { VerifyEmailTemplateData } from "../email.types";

export const verifyEmailTemplate = (data: VerifyEmailTemplateData): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to ZeilaHub 🎉</h2>

      ${
        data.name
          ? `<p>Hello <strong>${data.name}</strong>,</p>`
          : `<p>Hello,</p>`
      }

      <p>Please verify your email by clicking the button below:</p>

      <a href="${data.url}" 
         style="
           display:inline-block;
           padding:12px 20px;
           background-color:#2563eb;
           color:#ffffff;
           text-decoration:none;
           border-radius:5px;
           margin-top:10px;
         ">
         Verify Email
      </a>

      <p style="margin-top:20px;">
        If you didn’t create this account, you can ignore this email.
      </p>
    </div>
  `;
};
