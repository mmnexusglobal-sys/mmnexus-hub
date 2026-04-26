export type SocialChannel = "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "PINTEREST";
export type SocialProvider =
  | "make"
  | "manual-instagram"
  | "manual-pinterest"
  | "manual-tiktok"
  | "native-instagram"
  | "native-pinterest"
  | "native-tiktok";

export interface SocialPublishRequest {
  campaignId?: string;
  channel: SocialChannel;
  caption?: string;
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  tags: string[];
  scheduledAt?: string;
  objective?: string;
  tone?: string;
  contentFormat?: string;
  callToAction?: string;
  visualDirection?: string;
  assetBrief?: string;
}

export interface SocialPublishResult {
  channel: SocialChannel;
  status: "queued" | "published" | "scheduled" | "failed";
  externalId?: string;
  provider: SocialProvider;
  url?: string;
  nextStep?: string;
}

export interface SocialAsset {
  url: string;
  type: "IMAGE" | "VIDEO";
  aspectRatio?: string;
}
