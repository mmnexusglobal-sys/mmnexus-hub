import type { Decision } from "@/lib/domain/decision";
import type { SocialChannel, SocialAsset, SocialProvider } from "@/lib/domain/publish";

export type ChannelContentFormat =
  | "FEED_IMAGE"
  | "CAROUSEL"
  | "PIN"
  | "SHORT_VIDEO"
  | "STORY"
  | "REEL";

export type CommerceChannel = "PRINTIFY" | "SHOPIFY" | "TIKTOK_SHOP";
export type PublishJobStatus = "draft" | "scheduled" | "published" | "failed";
export type CommerceListingStatus = "draft" | "ready" | "published" | "failed";

export interface ProductMaster {
  concept: string;
  productType: Decision["productType"];
  title: string;
  description: string;
  tags: string[];
  imagePrompt?: string;
}

export interface ChannelPlan {
  channel: SocialChannel;
  objective: string;
  tone: string;
  contentFormat: ChannelContentFormat;
  headline?: string;
  caption: string;
  callToAction: string;
  tags: string[];
  visualDirection: string;
  assetBrief: string;
}

export interface ChannelAsset extends SocialAsset {
  channel: SocialChannel;
  variant: string;
  role: "PRIMARY" | "LIFESTYLE" | "VIDEO";
}

export interface ChannelPublishJob {
  channel: SocialChannel;
  status: PublishJobStatus;
  provider: SocialProvider;
  scheduledAt?: string;
  plan: ChannelPlan;
  asset?: ChannelAsset;
}

export interface CommerceListing {
  channel: CommerceChannel;
  status: CommerceListingStatus;
  title: string;
  description: string;
  tags: string[];
}

export interface CampaignBrief {
  campaignId: string;
  product: ProductMaster;
  channelPlans: ChannelPlan[];
  channelAssets: ChannelAsset[];
  publishJobs: ChannelPublishJob[];
  commerceListings: CommerceListing[];
}
