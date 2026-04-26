import type { SocialPublishRequest, SocialPublishResult, SocialChannel, SocialProvider } from "@/lib/domain/publish";
import type { SocialProviderHandler } from "@/lib/social/providers/types";

function buildManualResult(
  request: SocialPublishRequest,
  provider: SocialProvider,
  nextStep: string,
): SocialPublishResult {
  return {
    channel: request.channel,
    status: request.scheduledAt ? "scheduled" : "queued",
    provider,
    nextStep,
  };
}

function createManualProvider(
  channel: SocialChannel,
  provider: SocialProvider,
  nextStep: string,
): SocialProviderHandler {
  return {
    id: provider,
    channel,
    async publish(request: SocialPublishRequest): Promise<SocialPublishResult> {
      return buildManualResult(request, provider, nextStep);
    },
  };
}

export const manualInstagramProvider = createManualProvider(
  "INSTAGRAM",
  "manual-instagram",
  "Review the Instagram asset and caption, then publish manually from the business account.",
);

export const manualPinterestProvider = createManualProvider(
  "PINTEREST",
  "manual-pinterest",
  "Review the Pinterest pin asset, add destination URL, and publish manually in Pinterest.",
);

export const manualTikTokProvider = createManualProvider(
  "TIKTOK",
  "manual-tiktok",
  "Review the TikTok cover/video, then upload manually while native or Shop integration is pending.",
);
