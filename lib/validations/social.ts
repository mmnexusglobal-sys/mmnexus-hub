import { z } from "zod";

export const SocialChannelSchema = z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "PINTEREST"]);

export const SocialPublishRequestSchema = z.object({
  channel: SocialChannelSchema,
  caption: z.string().min(1, "Caption is required"),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).default([]),
  scheduledAt: z.string().datetime().optional()
}).refine(data => data.imageUrl || data.videoUrl, {
  message: "Either imageUrl or videoUrl must be provided",
  path: ["imageUrl"]
});

export type SocialPublishRequestDto = z.infer<typeof SocialPublishRequestSchema>;
