export type SocialChannel = "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "PINTEREST";

export interface SocialPublishRequest {
  channel: SocialChannel;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  tags: string[];
  scheduledAt?: string;
}

export interface SocialPublishResult {
  channel: SocialChannel;
  status: "queued" | "published" | "scheduled" | "failed";
  externalId?: string;
  provider: "make" | "native";
  url?: string;
}

export interface SocialAsset {
  url: string;
  type: "IMAGE" | "VIDEO";
}
