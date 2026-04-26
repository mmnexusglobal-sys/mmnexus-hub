import type { ChannelContentFormat } from "./campaign";
import type { SocialChannel, SocialAsset } from "./publish";

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
