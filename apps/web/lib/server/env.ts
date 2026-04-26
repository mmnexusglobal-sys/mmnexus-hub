import { z } from "zod";

const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string().min(1).optional(),
  PRINTIFY_API_TOKEN: z.string().min(1).optional(), // Cambiado a optional para build
  PRINTIFY_SHOP_ID: z.string().min(1).optional(),   // Cambiado a optional para build
  MAKE_WEBHOOK_URL: z.string().url().optional(),
});

// En lugar de fallar, extraemos lo que haya. Las validaciones estrictas se hacen en tiempo de ejecución.
const parsed = envSchema.safeParse(process.env);
export const env = parsed.success ? parsed.data : (process.env as Record<string, string>);

