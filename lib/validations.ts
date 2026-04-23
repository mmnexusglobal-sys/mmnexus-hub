import { z } from "zod";

export const DecisionSchema = z.object({
  productType: z.string().min(1, "productType is required"),
  blueprintId: z.union([z.string(), z.number()]).optional(),
  reason: z.string().min(1, "reason is required"),
  shopifyTitle: z.string().min(1, "shopifyTitle is required"),
  socialCopy: z.string().min(1, "socialCopy is required"),
  seoTags: z.array(z.string()).min(1, "at least one seoTag is required"),
  imagePrompt: z.string().optional(),
});

export type DecisionData = z.infer<typeof DecisionSchema>;

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

export const PublishResultSchema = z.object({
  platform: z.enum(["Instagram", "TikTok", "Pinterest", "Shopify", "Printify"]),
  success: z.boolean(),
  url: z.string().url().optional(),
  error: z.string().optional(),
});

export type PublishResultData = z.infer<typeof PublishResultSchema>;
