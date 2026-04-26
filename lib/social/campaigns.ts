import type { Decision } from "@/lib/domain/decision";
import type {
  CampaignBrief,
  ChannelAsset,
  ChannelPlan,
  ChannelPublishJob,
  CommerceListing,
} from "@/lib/domain/campaign";
import type { SocialChannel } from "@/lib/domain/publish";

interface BuildCampaignBriefOptions {
  concept: string;
  decision: Partial<Decision>;
  imageUrl?: string | null;
  lifestyleImageUrl?: string | null;
  videoUrl?: string | null;
}

function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#/, "").replace(/\s+/g, "");
}

function buildCampaignId(concept: string): string {
  const base = concept
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `campaign-${base || "mmnexus"}`;
}

function buildInstagramPlan(productTitle: string, baseCaption: string, tags: string[]): ChannelPlan {
  return {
    channel: "INSTAGRAM",
    objective: "Convert discovery into saves and product clicks.",
    tone: "editorial, aspirational, polished",
    contentFormat: "FEED_IMAGE",
    headline: productTitle,
    caption: `${baseCaption}\n\nDesigned to feel premium in-feed and worth sharing.`,
    callToAction: "Tap through to shop the drop.",
    tags: tags.slice(0, 8),
    visualDirection: "Lifestyle-forward composition, premium lighting, fashion-first framing.",
    assetBrief: "Square or portrait asset with editorial styling, product prominence, and cleaner branding.",
  };
}

function buildPinterestPlan(productTitle: string, baseCaption: string, tags: string[]): ChannelPlan {
  return {
    channel: "PINTEREST",
    objective: "Capture search intent and evergreen discovery.",
    tone: "searchable, helpful, inspirational",
    contentFormat: "PIN",
    headline: `${productTitle} | Trend-ready idea`,
    caption: `${productTitle}. ${baseCaption} Save this idea for your next outfit, gift, or room refresh.`,
    callToAction: "Save this pin and visit the product page.",
    tags: tags.slice(0, 10),
    visualDirection: "Vertical composition, keyword-friendly overlay hierarchy, discovery-oriented styling.",
    assetBrief: "2:3 vertical pin with stronger text hierarchy, cleaner product focus, and browse-first composition.",
  };
}

function buildTikTokPlan(productTitle: string, baseCaption: string, tags: string[]): ChannelPlan {
  return {
    channel: "TIKTOK",
    objective: "Win attention in the first seconds and drive action.",
    tone: "hook-first, energetic, conversational",
    contentFormat: "SHORT_VIDEO",
    headline: productTitle,
    caption: `POV: you just found the ${productTitle.toLowerCase()} that does not look generic.\n${baseCaption}`,
    callToAction: "Watch the reveal and shop before it sells out.",
    tags: tags.slice(0, 6),
    visualDirection: "9:16 framing, fast reveal, strong contrast, movement cues for short-form video.",
    assetBrief: "Vertical video-ready asset or cover frame optimized for first-second hook and mobile legibility.",
  };
}

function buildAssets(
  imageUrl: string | null | undefined,
  lifestyleImageUrl: string | null | undefined,
  videoUrl: string | null | undefined,
): ChannelAsset[] {
  const assets: ChannelAsset[] = [];

  if (lifestyleImageUrl) {
    assets.push({
      channel: "INSTAGRAM",
      url: lifestyleImageUrl,
      type: "IMAGE",
      aspectRatio: "4:5",
      variant: "instagram-lifestyle",
      role: "LIFESTYLE",
    });
  } else if (imageUrl) {
    assets.push({
      channel: "INSTAGRAM",
      url: imageUrl,
      type: "IMAGE",
      aspectRatio: "1:1",
      variant: "instagram-primary",
      role: "PRIMARY",
    });
  }

  if (imageUrl) {
    assets.push({
      channel: "PINTEREST",
      url: imageUrl,
      type: "IMAGE",
      aspectRatio: "2:3",
      variant: "pinterest-pin",
      role: "PRIMARY",
    });
  }

  if (videoUrl) {
    assets.push({
      channel: "TIKTOK",
      url: videoUrl,
      type: "VIDEO",
      aspectRatio: "9:16",
      variant: "tiktok-video",
      role: "VIDEO",
    });
  } else if (imageUrl) {
    assets.push({
      channel: "TIKTOK",
      url: imageUrl,
      type: "IMAGE",
      aspectRatio: "9:16",
      variant: "tiktok-cover",
      role: "PRIMARY",
    });
  }

  return assets;
}

function buildPublishJobs(channelPlans: ChannelPlan[], channelAssets: ChannelAsset[]): ChannelPublishJob[] {
  return channelPlans.map((plan) => ({
    channel: plan.channel,
    status: "draft",
    provider:
      plan.channel === "INSTAGRAM"
        ? "manual-instagram"
        : plan.channel === "PINTEREST"
          ? "manual-pinterest"
          : "manual-tiktok",
    plan,
    asset: channelAssets.find((asset) => asset.channel === plan.channel),
  }));
}

function buildCommerceListings(productTitle: string, baseCaption: string, tags: string[]): CommerceListing[] {
  return [
    {
      channel: "PRINTIFY",
      status: "draft",
      title: productTitle,
      description: baseCaption,
      tags,
    },
    {
      channel: "SHOPIFY",
      status: "draft",
      title: productTitle,
      description: baseCaption,
      tags,
    },
    {
      channel: "TIKTOK_SHOP",
      status: "draft",
      title: productTitle,
      description: `${baseCaption} Optimized for short-form social commerce conversion.`,
      tags,
    },
  ];
}

export function buildCampaignBrief({
  concept,
  decision,
  imageUrl,
  lifestyleImageUrl,
  videoUrl,
}: BuildCampaignBriefOptions): CampaignBrief {
  const productTitle = decision.shopifyTitle || concept;
  const baseCaption = decision.socialCopy || `Discover ${productTitle} in the MMNexus pipeline.`;
  const tags = (decision.seoTags || ["mmnexus", "design", "trend"]).map(normalizeTag);

  const channelPlans = [
    buildInstagramPlan(productTitle, baseCaption, tags),
    buildPinterestPlan(productTitle, baseCaption, tags),
    buildTikTokPlan(productTitle, baseCaption, tags),
  ];

  const channelAssets = buildAssets(imageUrl, lifestyleImageUrl, videoUrl);

  return {
    campaignId: buildCampaignId(concept),
    product: {
      concept,
      productType: decision.productType || "T_SHIRT",
      title: productTitle,
      description: baseCaption,
      tags,
      imagePrompt: decision.imagePrompt,
    },
    channelPlans,
    channelAssets,
    publishJobs: buildPublishJobs(channelPlans, channelAssets),
    commerceListings: buildCommerceListings(productTitle, baseCaption, tags),
  };
}

export function getChannelPlan(
  campaignBrief: CampaignBrief,
  channel: SocialChannel,
): ChannelPlan | undefined {
  return campaignBrief.channelPlans.find((plan) => plan.channel === channel);
}

export function getChannelAsset(
  campaignBrief: CampaignBrief,
  channel: SocialChannel,
): ChannelAsset | undefined {
  return campaignBrief.channelAssets.find((asset) => asset.channel === channel);
}
