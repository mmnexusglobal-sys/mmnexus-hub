import { z } from "zod";
import { DecisionSchema } from "../validations";

export const createProductInputSchema = z.object({
  imageUrl: z.string().min(1, "Se requiere una imagen en formato base64"),
  decision: DecisionSchema,
});
