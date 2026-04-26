import type { SocialChannel } from "@/lib/domain/publish";
import {
  manualInstagramProvider,
  manualPinterestProvider,
  manualTikTokProvider,
} from "@/lib/social/providers/manual";
import type { SocialProviderHandler } from "@/lib/social/providers/types";

const providersByChannel: Partial<Record<SocialChannel, SocialProviderHandler>> = {
  INSTAGRAM: manualInstagramProvider,
  PINTEREST: manualPinterestProvider,
  TIKTOK: manualTikTokProvider,
};

export function resolveSocialProvider(channel: SocialChannel): SocialProviderHandler {
  const provider = providersByChannel[channel];

  if (!provider) {
    throw new Error(`No social provider configured for channel ${channel}`);
  }

  return provider;
}
