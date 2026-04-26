# MMNexus Hub

MMNexus Hub is a multi-agent ecommerce and social content orchestration app for print-on-demand workflows.

The current architecture is evolving from a single linear AI pipeline into a multichannel campaign system:

- one product concept
- one product master decision
- multiple channel plans
- multiple derived assets
- multiple publish jobs
- multiple commerce listings

## Current Architecture

The app is organized around thin API routes plus domain and service layers:

- `app/api/ai/decision`
  Generates the core product decision and base campaign inputs.
- `app/api/ai/image`
  Generates the base visual asset.
- `app/api/ai/channel-asset`
  Derives channel-specific visual assets for Instagram, Pinterest, and TikTok.
- `app/api/ai/video`
  Generates or simulates short-form video output for TikTok/Reels flows.
- `app/api/social/publish`
  Accepts a structured social publish job and routes it through the configured channel provider.
- `app/api/printify/create`
  Creates the commerce product in Printify.

Key domain modules:

- `lib/domain/decision.ts`
  Core product decision contract.
- `lib/domain/campaign.ts`
  Campaign-level contracts: `CampaignBrief`, `ChannelPlan`, `ChannelAsset`, `ChannelPublishJob`, and `CommerceListing`.
- `lib/domain/publish.ts`
  Social publish contract used by the publish API/service/provider stack.

Key services:

- `lib/ai/decision-service.ts`
  Owns prompt building, trends loading, model fallback, JSON extraction, and decision validation.
- `lib/ai/image-service.ts`
  Generates base imagery with provider fallback.
- `lib/ai/channel-asset-service.ts`
  Generates channel-native derived assets using each channel plan's visual direction and asset brief.
- `lib/social/publish-service.ts`
  Thin domain-level publish service above the provider registry.

## Phases

### Phase 1

Completed foundation for multichannel campaigns:

- campaign-level domain model
- channel-specific plans
- channel-specific assets
- channel publish jobs
- commerce listing placeholders, including `TIKTOK_SHOP`
- channel-aware social dashboard

### Phase 2

Completed initial asset derivation foundation:

- new `channel-asset` API route
- channel-specific derived image generation
- Instagram lifestyle-style derivative path
- Pinterest pin-style derivative path
- TikTok cover derivative path
- TikTok video generation remains a separate flow for now

### Phase 3

Current provider orchestration foundation:

- provider-oriented social publish service
- channel-specific manual providers for Instagram, Pinterest, and TikTok
- no dependency on Make for the current workflow
- native provider slots reserved for later integration

Next:

- native Instagram provider
- native Pinterest provider
- TikTok posting provider
- TikTok Shop catalog/listing sync
- durable campaign persistence

## Social Strategy Direction

MMNexus no longer treats social as "one copy, one image, all networks."

The target model is:

- Instagram: editorial, premium, lifestyle, save/share oriented
- Pinterest: search/discovery oriented, vertical composition, keyword-friendly
- TikTok: hook-first, short-form, motion-first, conversion oriented

Each network should end up with:

- distinct copy
- distinct visual direction
- distinct asset specification
- distinct publish job

## Development

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Current integrations expect some or all of the following variables:

- `GOOGLE_AI_API_KEY`
- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `MAKE_WEBHOOK_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Deployment Notes

The app is a good fit for Vercel, but production rollout should include durable persistence for campaign and trend data.

Known caveats:

- `app/api/ai/trends` still writes to local JSON and should move to durable storage before production use.
- repo-wide encoding cleanup is still pending in several files.
- native platform providers are not implemented yet; current publish flow uses manual channel providers while Make remains inactive.
