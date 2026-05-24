import { ResetPasswordTemplateData } from "../email.types";

export const resetPasswordTemplate = (
  data: ResetPasswordTemplateData,
): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset</h2>

      ${
        data.name
          ? `<p>Hello <strong>${data.name}</strong>,</p>`
          : `<p>Hello,</p>`
      }

      <p>Click the button below to reset your password:</p>

      <a href="${data.url}" 
         style="
           display:inline-block;
           padding:12px 20px;
           background-color:#dc2626;
           color:#ffffff;
           text-decoration:none;
           border-radius:5px;
           margin-top:10px;
         ">
         Reset Password
      </a>

      <p style="margin-top:20px;">
        This link expires in 24 hours.
      </p>
    </div>
  `;
};
