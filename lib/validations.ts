import { z } from "zod";

export { DecisionSchema } from "@/lib/validations/ai";
export type { DecisionDto as DecisionData } from "@/lib/validations/ai";

export const TrendReportSchema = z.object({
  topic: z.string(),
  score: z.number().min(0).max(100),
  summary: z.string(),
  keywords: z.array(z.string()),
});

export type TrendReportData = z.infer<typeof TrendReportSchema>;

export const DesignAssetSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
  style: z.string(),
});

export type DesignAssetData = z.infer<typeof DesignAssetSchema>;

export const PublishRequestSchema = z.object({
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  socialCopy: z.string().min(1, "socialCopy is required"),
  productType: z.string().min(1, "productType is required"),
  platform: z.enum(["Instagram", "TikTok", "Pinterest", "Shopify", "Printify"]),
});

export type PublishRequestData = z.infer<typeof PublishRequestSchema>;

export const PublishResultSchema = z.object({
  platform: z.enum(["Instagram", "TikTok", "Pinterest", "Shopify", "Printify"]),
  success: z.boolean(),
  url: z.string().url().optional(),
  error: z.string().optional(),
});

export type PublishResultData = z.infer<typeof PublishResultSchema>;

export const NicheSchema = z.object({
  name: z.string(),
  description: z.string(),
  idealDesigns: z.array(z.string()),
  recommendedProducts: z.array(z.string()),
  emergingSubNiche: z.string().optional(),
});

export const ViralTrendSchema = z.object({
  concept: z.string(),
  description: z.string(),
});

export const FullTrendReportSchema = z.object({
  date: z.string(),
  niches: z.array(NicheSchema),
  viralTrends: z.array(ViralTrendSchema).optional(),
  socialSignals: z.object({
    opportunity: z.string().optional(),
    signals: z.array(z.string()).optional()
  }).optional(),
  highConversionKeywords: z.array(z.string()).optional(),
});

export type FullTrendReportData = z.infer<typeof FullTrendReportSchema>;
