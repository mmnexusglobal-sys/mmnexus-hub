import type { GenerateChannelAssetRequest, GenerateChannelAssetResult } from "@/lib/domain/channel-asset";
import { generateImageService } from "@/lib/ai/image-service";

function resolveDimensions(channel: GenerateChannelAssetRequest["channel"]) {
  switch (channel) {
    case "INSTAGRAM":
      return { width: 1080, height: 1350, aspectRatio: "4:5", variant: "instagram-derived" };
    case "PINTEREST":
      return { width: 1000, height: 1500, aspectRatio: "2:3", variant: "pinterest-derived" };
    case "TIKTOK":
      return { width: 1080, height: 1920, aspectRatio: "9:16", variant: "tiktok-cover-derived" };
    case "FACEBOOK":
    default:
      return { width: 1080, height: 1080, aspectRatio: "1:1", variant: "facebook-derived" };
  }
}

function buildDerivedPrompt(request: GenerateChannelAssetRequest): string {
  const basePrompt = request.basePrompt?.trim()
    ? `Base visual concept: ${request.basePrompt.trim()}.`
    : `Base visual concept: ${request.concept}.`;

  return [
    `${basePrompt}`,
    `Target channel: ${request.channel}.`,
    `Format goal: ${request.contentFormat}.`,
    `Product title: ${request.productTitle}.`,
    `Visual direction: ${request.visualDirection}.`,
    `Asset brief: ${request.assetBrief}.`,
    "Produce a social-ready asset with strong composition, clean hierarchy, product relevance, and no watermarks.",
    "Keep the result production-ready for ecommerce marketing and platform-native communication.",
  ].join(" ");
}

export async function generateChannelAssetService(
  request: GenerateChannelAssetRequest,
): Promise<GenerateChannelAssetResult> {
  const dimensions = resolveDimensions(request.channel);
  const derivedPrompt = buildDerivedPrompt(request);

  const imageResult = await generateImageService({
    prompt: derivedPrompt,
    width: dimensions.width,
    height: dimensions.height,
  });

  return {
    channel: request.channel,
    url: imageResult.url,
    type: "IMAGE",
    aspectRatio: dimensions.aspectRatio,
    provider: imageResult.provider,
    warning: imageResult.warning,
    seed: imageResult.seed,
    derivedPrompt,
    variant: dimensions.variant,
  };
}
