import type { SocialPublishResult, SocialPublishRequest } from "@/lib/domain/publish";
import { resolveSocialProvider } from "@/lib/social/providers/registry";

export async function publishSocialService(
  publishRequest: SocialPublishRequest,
): Promise<SocialPublishResult> {
  const provider = resolveSocialProvider(publishRequest.channel);
  return provider.publish(publishRequest);
}
