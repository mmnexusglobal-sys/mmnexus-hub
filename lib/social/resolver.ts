import type { SocialPublishRequest } from "@/lib/domain/publish";
import type { MakeWebhookPayload } from "@/lib/integrations/make/client";

export function resolveMakePayload(request: SocialPublishRequest): MakeWebhookPayload {
  const hashtags = request.tags.map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" ");
  const caption = request.caption || "";
  const fullCaption = hashtags ? `${caption}\n\n${hashtags}` : caption;

  const payloadData: Record<string, unknown> = {
    caption: fullCaption,
    scheduledAt: request.scheduledAt,
    campaignId: request.campaignId,
    objective: request.objective,
    tone: request.tone,
    contentFormat: request.contentFormat,
    callToAction: request.callToAction,
    visualDirection: request.visualDirection,
    assetBrief: request.assetBrief,
  };

  if (request.title) {
    payloadData.title = request.title;
  }

  if (request.imageUrl) {
    payloadData.mediaUrl = request.imageUrl;
    payloadData.mediaType = "IMAGE";
  } else if (request.videoUrl) {
    payloadData.mediaUrl = request.videoUrl;
    payloadData.mediaType = "VIDEO";
  }

  return {
    platform: request.channel.toLowerCase(),
    action: request.scheduledAt ? "schedule_post" : "publish_post",
    data: payloadData,
  };
}
