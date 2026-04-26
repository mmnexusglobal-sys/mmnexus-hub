import { z } from "zod";
import { decisionProductTypes } from "@/lib/domain/decision";
import { SocialChannelSchema } from "@/lib/validations/social";

export const GenerateDecisionRequestSchema = z.object({
  concept: z.string().min(1, "Concept is required"),
});

export type GenerateDecisionRequestDto = z.infer<typeof GenerateDecisionRequestSchema>;

export const DecisionSchema = z.object({
  productType: z.enum(decisionProductTypes),
  blueprintId: z.union([z.string(), z.number()]).optional(),
  reason: z.string().min(1, "reason is required"),
  shopifyTitle: z.string().min(1, "shopifyTitle is required"),
  socialCopy: z.string().min(1, "socialCopy is required"),
  seoTags: z.array(z.string().min(1, "seoTags cannot contain empty values")).min(1, "at least one seoTag is required"),
  imagePrompt: z.string().min(1, "imagePrompt is required").optional(),
});

export type DecisionDto = z.infer<typeof DecisionSchema>;

export const GenerateChannelAssetRequestSchema = z.object({
  channel: SocialChannelSchema,
  concept: z.string().min(1, "Concept is required"),
  productTitle: z.string().min(1, "Product title is required"),
  basePrompt: z.string().optional(),
  visualDirection: z.string().min(1, "Visual direction is required"),
  assetBrief: z.string().min(1, "Asset brief is required"),
  contentFormat: z.enum(["FEED_IMAGE", "CAROUSEL", "PIN", "SHORT_VIDEO", "STORY", "REEL"]),
});

export type GenerateChannelAssetRequestDto = z.infer<typeof GenerateChannelAssetRequestSchema>;

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
