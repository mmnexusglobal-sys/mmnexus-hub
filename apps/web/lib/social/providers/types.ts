import type { SocialPublishRequest, SocialPublishResult, SocialChannel, SocialProvider } from "@/lib/domain/publish";

export interface SocialProviderHandler {
  id: SocialProvider;
  channel: SocialChannel;
  publish(request: SocialPublishRequest): Promise<SocialPublishResult>;
}
