import { z } from "zod";

export const upgradeToSellerSchema = z.object({
  companyName: z.string().min(2),
  phoneNumber: z.string().optional(),
});
