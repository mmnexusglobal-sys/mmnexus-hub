import { z } from "zod";

export const GenerateImageRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  seed: z.number().optional(),
  width: z.number().default(1024),
  height: z.number().default(1024),
});

export type GenerateImageRequestDto = z.infer<typeof GenerateImageRequestSchema>;

export const ExtractTrendsRequestSchema = z.object({
  reportText: z.string().min(10, "El reporte debe tener al menos 10 caracteres"),
});

export type ExtractTrendsRequestDto = z.infer<typeof ExtractTrendsRequestSchema>;

export const TrendReportSchema = z.object({
  topic: z.string(),
  score: z.number().min(0).max(100),
  summary: z.string(),
  keywords: z.array(z.string()),
});

export type TrendReportDto = z.infer<typeof TrendReportSchema>;
