import { z } from "zod";

export const SocialChannelSchema = z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "PINTEREST"]);

const ChannelPlanSchema = z.object({
  channel: SocialChannelSchema,
  objective: z.string().min(1),
  tone: z.string().min(1),
  contentFormat: z.string().min(1),
  headline: z.string().optional(),
  caption: z.string().min(1),
  callToAction: z.string().min(1),
  tags: z.array(z.string()).default([]),
  visualDirection: z.string().min(1),
  assetBrief: z.string().min(1),
});

const ChannelAssetSchema = z.object({
  channel: SocialChannelSchema,
  url: z.string().url(),
  type: z.enum(["IMAGE", "VIDEO"]),
  aspectRatio: z.string().optional(),
  variant: z.string().min(1),
  role: z.enum(["PRIMARY", "LIFESTYLE", "VIDEO"]),
});

export const SocialPublishRequestSchema = z.object({
  campaignId: z.string().optional(),
  channel: SocialChannelSchema,
  caption: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).default([]),
  scheduledAt: z.string().datetime().optional(),
  objective: z.string().optional(),
  tone: z.string().optional(),
  contentFormat: z.string().optional(),
  callToAction: z.string().optional(),
  visualDirection: z.string().optional(),
  assetBrief: z.string().optional(),
  plan: ChannelPlanSchema.optional(),
  asset: ChannelAssetSchema.optional(),
}).transform((data) => {
  const normalizedCaption = data.plan?.caption ?? data.caption;
  const normalizedTitle = data.plan?.headline ?? data.title;
  const normalizedTags = data.plan?.tags ?? data.tags;
  const normalizedImageUrl = data.asset?.type === "IMAGE" ? data.asset.url : data.imageUrl;
  const normalizedVideoUrl = data.asset?.type === "VIDEO" ? data.asset.url : data.videoUrl;

  return {
    campaignId: data.campaignId,
    channel: data.channel,
    caption: normalizedCaption,
    imageUrl: normalizedImageUrl,
    videoUrl: normalizedVideoUrl,
    title: normalizedTitle,
    tags: normalizedTags,
    scheduledAt: data.scheduledAt,
    objective: data.plan?.objective ?? data.objective,
    tone: data.plan?.tone ?? data.tone,
    contentFormat: data.plan?.contentFormat ?? data.contentFormat,
    callToAction: data.plan?.callToAction ?? data.callToAction,
    visualDirection: data.plan?.visualDirection ?? data.visualDirection,
    assetBrief: data.plan?.assetBrief ?? data.assetBrief,
  };
}).refine((data) => Boolean(data.caption), {
  message: "Caption is required",
  path: ["caption"],
}).refine((data) => Boolean(data.imageUrl || data.videoUrl), {
  message: "Either imageUrl or videoUrl must be provided",
  path: ["imageUrl"],
});

export type SocialPublishRequestDto = z.infer<typeof SocialPublishRequestSchema>;
