import type { ChannelContentFormat } from "@/lib/domain/campaign";
import type { SocialChannel, SocialAsset } from "@/lib/domain/publish";

export interface GenerateChannelAssetRequest {
  channel: SocialChannel;
  concept: string;
  productTitle: string;
  basePrompt?: string;
  visualDirection: string;
  assetBrief: string;
  contentFormat: ChannelContentFormat;
}

export interface GenerateChannelAssetResult extends SocialAsset {
  channel: SocialChannel;
  provider: "google-ai" | "pollinations";
  warning?: string;
  seed?: number;
  derivedPrompt: string;
  variant: string;
}
