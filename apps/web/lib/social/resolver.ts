import type { SocialPublishRequest } from "@/lib/domain/publish";
import type { MakeWebhookPayload } from "@/lib/integrations/make/client";

/**
 * Convierte una intención de dominio genérica en el payload específico 
 * que espera Make.com para enrutar a la red social correspondiente.
 */
export function resolveMakePayload(request: SocialPublishRequest): MakeWebhookPayload {
  const hashtags = request.tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  const fullCaption = `${request.caption}\n\n${hashtags}`;

  // Aquí definimos las reglas de formato según el canal. 
  // Podríamos tener diferentes estructuras si Make espera cosas distintas por canal.
  const payloadData: Record<string, any> = {
    caption: fullCaption,
    scheduledAt: request.scheduledAt,
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
