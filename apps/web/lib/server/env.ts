import { z } from "zod";

const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().min(1).optional(),
  PRINTIFY_API_TOKEN: z.string().min(1),
  PRINTIFY_SHOP_ID: z.string().min(1),
  MAKE_WEBHOOK_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
