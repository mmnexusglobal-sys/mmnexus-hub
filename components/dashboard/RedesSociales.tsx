import { useState, type ReactNode } from "react";
import { Camera, CheckCircle2, Loader2, Music2, Share2, Video } from "lucide-react";

import type { GenerateChannelAssetResult } from "@/lib/domain/channel-asset";
import type { ChannelAsset } from "@/lib/domain/campaign";
import type { SocialChannel, SocialPublishResult } from "@/lib/domain/publish";
import type { DecisionData } from "@/lib/validations";
import { buildCampaignBrief, getChannelAsset, getChannelPlan } from "@/lib/social/campaigns";

const initialChannelState: Record<SocialChannel, boolean> = {
  INSTAGRAM: false,
  FACEBOOK: false,
  TIKTOK: false,
  PINTEREST: false,
};

export default function RedesSociales({
  decision,
  imageUrl,
}: {
  decision: Partial<DecisionData> | null;
  imageUrl: string | null;
}) {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [publishingByChannel, setPublishingByChannel] = useState(initialChannelState);
  const [generatingByChannel, setGeneratingByChannel] = useState(initialChannelState);
  const [derivedAssets, setDerivedAssets] = useState<Partial<Record<SocialChannel, GenerateChannelAssetResult>>>({});
  const [jobResults, setJobResults] = useState<Partial<Record<SocialChannel, SocialPublishResult>>>({});

  if (!decision || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <Share2 className="w-16 h-16 opacity-20" />
        <p className="text-lg">No hay ningun producto generado.</p>
        <p className="text-sm">Ve al Dashboard o al Generador IA para crear un nuevo diseno primero.</p>
      </div>
    );
  }

  const campaignBrief = buildCampaignBrief({
    concept: decision.shopifyTitle || decision.reason || "mmnexus-drop",
    decision,
    imageUrl,
    lifestyleImageUrl: derivedAssets.INSTAGRAM?.url || null,
    videoUrl,
  });

  const instagramPlan = getChannelPlan(campaignBrief, "INSTAGRAM");
  const pinterestPlan = getChannelPlan(campaignBrief, "PINTEREST");
  const tiktokPlan = getChannelPlan(campaignBrief, "TIKTOK");

  const handleGenerateChannelAsset = async (channel: SocialChannel) => {
    const plan = getChannelPlan(campaignBrief, channel);
    if (!plan) return;

    setGeneratingByChannel((current) => ({ ...current, [channel]: true }));
    try {
      const res = await fetch("/api/ai/channel-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          concept: campaignBrief.product.concept,
          productTitle: campaignBrief.product.title,
          basePrompt: campaignBrief.product.imagePrompt,
          visualDirection: plan.visualDirection,
          assetBrief: plan.assetBrief,
          contentFormat: plan.contentFormat,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error generando asset derivado.");
      }

      setDerivedAssets((current) => ({ ...current, [channel]: data.asset }));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error generando asset del canal.");
    } finally {
      setGeneratingByChannel((current) => ({ ...current, [channel]: false }));
    }
  };

  const handleGenerateVideo = async () => {
    if (!tiktokPlan) return;

    setIsGeneratingVideo(true);
    try {
      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, socialCopy: tiktokPlan.caption }),
      });

      const data = await res.json();
      if (data.success) {
        setVideoUrl(data.videoUrl);
      } else {
        alert("Error generando el video: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Fallo de conexion al generar video.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const resolveChannelAsset = (channel: SocialChannel): ChannelAsset | undefined => {
    const derivedAsset = derivedAssets[channel];
    if (derivedAsset) {
      return {
        channel,
        url: derivedAsset.url,
        type: derivedAsset.type,
        aspectRatio: derivedAsset.aspectRatio,
        variant: derivedAsset.variant,
        role: channel === "INSTAGRAM" ? "LIFESTYLE" : "PRIMARY",
      };
    }

    if (channel === "TIKTOK" && videoUrl) {
      return {
        channel,
        url: videoUrl,
        type: "VIDEO",
        aspectRatio: "9:16",
        variant: "tiktok-video",
        role: "VIDEO",
      };
    }

    return getChannelAsset(campaignBrief, channel);
  };

  const handlePublish = async (channel: SocialChannel) => {
    const plan = getChannelPlan(campaignBrief, channel);
    const asset = resolveChannelAsset(channel);

    if (!plan || !asset) {
      alert("No hay plan o asset listo para este canal.");
      return;
    }

    setPublishingByChannel((current) => ({ ...current, [channel]: true }));
    try {
      const res = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaignBrief.campaignId,
          channel,
          plan,
          asset,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error publicando en red social.");
      }

      setJobResults((current) => ({ ...current, [channel]: data.result }));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error publicando contenido.");
    } finally {
      setPublishingByChannel((current) => ({ ...current, [channel]: false }));
    }
  };

  const instagramAsset = resolveChannelAsset("INSTAGRAM");
  const pinterestAsset = resolveChannelAsset("PINTEREST");
  const tiktokAsset = resolveChannelAsset("TIKTOK");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Share2 className="w-8 h-8 text-pink-400" />
          Campaign Orchestrator
        </h2>
        <p className="text-slate-400">Fase 2: planes y assets derivados por canal para el mismo producto.</p>
      </header>

      <div className="bg-white/2 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-200">
            Campaign ID: {campaignBrief.campaignId}
          </span>
          <span className="px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
            Producto: {campaignBrief.product.title}
          </span>
          <span className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            TikTok Shop: {campaignBrief.commerceListings.find((listing) => listing.channel === "TIKTOK_SHOP")?.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChannelCard
          accent="pink"
          title="Instagram"
          subtitle="Editorial feed / lifestyle storytelling"
          plan={instagramPlan}
          asset={instagramAsset}
          mediaPreview={instagramAsset?.url || imageUrl}
          mediaLabel={derivedAssets.INSTAGRAM ? "Asset derivado listo" : "Usando asset base"}
          isGenerating={generatingByChannel.INSTAGRAM}
          isPublishing={publishingByChannel.INSTAGRAM}
          result={jobResults.INSTAGRAM}
          onGenerate={() => handleGenerateChannelAsset("INSTAGRAM")}
          onPublish={() => handlePublish("INSTAGRAM")}
          generateLabel="Derivar asset de Instagram"
          icon={<Camera className="w-5 h-5" />}
        />

        <ChannelCard
          accent="red"
          title="Pinterest"
          subtitle="Discovery-first / visual search intent"
          plan={pinterestPlan}
          asset={pinterestAsset}
          mediaPreview={pinterestAsset?.url || imageUrl}
          mediaLabel={derivedAssets.PINTEREST ? "Pin derivado listo" : "Pin vertical pendiente de asset derivado"}
          isGenerating={generatingByChannel.PINTEREST}
          isPublishing={publishingByChannel.PINTEREST}
          result={jobResults.PINTEREST}
          onGenerate={() => handleGenerateChannelAsset("PINTEREST")}
          onPublish={() => handlePublish("PINTEREST")}
          generateLabel="Derivar asset de Pinterest"
          icon={<Share2 className="w-5 h-5" />}
        />

        <ChannelCard
          accent="cyan"
          title="TikTok"
          subtitle="Hook-first / short-form conversion"
          plan={tiktokPlan}
          asset={tiktokAsset}
          mediaPreview={tiktokAsset?.url || imageUrl}
          mediaLabel={
            videoUrl
              ? "Video asset listo"
              : derivedAssets.TIKTOK
                ? "Cover derivado listo"
                : "Usando cover temporal"
          }
          isGenerating={generatingByChannel.TIKTOK || isGeneratingVideo}
          isPublishing={publishingByChannel.TIKTOK}
          result={jobResults.TIKTOK}
          onGenerate={() => handleGenerateChannelAsset("TIKTOK")}
          secondaryGenerateAction={!videoUrl ? (
            <button
              onClick={handleGenerateVideo}
              disabled={isGeneratingVideo}
              className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/40 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isGeneratingVideo ? "Renderizando video..." : "Generar video de TikTok"}
            </button>
          ) : undefined}
          onPublish={() => handlePublish("TIKTOK")}
          generateLabel="Derivar cover de TikTok"
          icon={<Music2 className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}

function ChannelCard({
  accent,
  title,
  subtitle,
  plan,
  asset,
  mediaPreview,
  mediaLabel,
  isGenerating,
  isPublishing,
  result,
  onGenerate,
  secondaryGenerateAction,
  onPublish,
  generateLabel,
  icon,
}: {
  accent: "pink" | "red" | "cyan";
  title: string;
  subtitle: string;
  plan: ReturnType<typeof getChannelPlan>;
  asset: ChannelAsset | undefined;
  mediaPreview: string | null;
  mediaLabel: string;
  isGenerating: boolean;
  isPublishing: boolean;
  result?: SocialPublishResult;
  onGenerate: () => void;
  secondaryGenerateAction?: ReactNode;
  onPublish: () => void;
  generateLabel: string;
  icon: ReactNode;
}) {
  const accentConfig = {
    pink: {
      gradient: "from-pink-500/10 to-orange-500/10",
      border: "border-pink-500/20",
      title: "text-pink-100",
      badge: "text-pink-400",
      button: "bg-linear-to-r from-pink-600 to-orange-500 text-white",
    },
    red: {
      gradient: "from-red-500/10 to-rose-500/10",
      border: "border-red-500/20",
      title: "text-red-100",
      badge: "text-red-400",
      button: "bg-red-500/20 text-red-300 border border-red-500/30",
    },
    cyan: {
      gradient: "from-cyan-500/10 to-blue-500/10",
      border: "border-cyan-500/20",
      title: "text-cyan-100",
      badge: "text-cyan-400",
      button: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
    },
  }[accent];

  return (
    <div className={`bg-linear-to-br ${accentConfig.gradient} border ${accentConfig.border} rounded-2xl p-6 space-y-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-bold text-lg ${accentConfig.title} flex items-center gap-2`}>
            {icon}
            {title}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 ${accentConfig.badge}`}>
          {plan?.contentFormat || "DRAFT"}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <InfoRow label="Objetivo" value={plan?.objective} />
        <InfoRow label="Tono" value={plan?.tone} />
        <InfoRow label="Direccion visual" value={plan?.visualDirection} />
        <InfoRow label="CTA" value={plan?.callToAction} />
      </div>

      <div className="bg-black/40 rounded-xl p-4 border border-white/5">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Copy del canal</p>
        <p className="text-slate-300 whitespace-pre-wrap">{plan?.caption || "Sin copy todavia."}</p>
        <p className="text-slate-500 text-xs mt-3">
          {plan?.tags.map((tag) => `#${tag}`).join(" ")}
        </p>
      </div>

      <div className="bg-black/30 rounded-xl p-4 border border-white/5">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Asset</p>
        <p className="text-slate-300 text-sm">{asset?.aspectRatio || mediaLabel}</p>
        <p className="text-slate-500 text-xs mt-1">
          {asset ? `${asset.type} · ${asset.variant} · ${asset.role}` : "Sin asset listo"}
        </p>
        {isGenerating ? (
          <p className="text-xs text-slate-400 mt-2">Generando derivado especifico del canal...</p>
        ) : null}
        {mediaPreview ? (
          <p className="text-slate-500 text-xs mt-3 break-all">{mediaPreview}</p>
        ) : null}
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${accentConfig.button}`}
      >
        {isGenerating ? "Derivando asset..." : generateLabel}
      </button>

      {secondaryGenerateAction}

      {result ? (
        <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 py-3 px-4 rounded-xl">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Job {result.status}
          </div>
          <p className="text-xs text-emerald-200/80 mt-2">Proveedor: {result.provider}</p>
          {result.nextStep ? (
            <p className="text-xs text-emerald-200/80 mt-1">{result.nextStep}</p>
          ) : null}
        </div>
      ) : (
        <button
          onClick={onPublish}
          disabled={!plan || !asset || isPublishing}
          className="w-full bg-white/10 text-slate-100 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
          {isPublishing ? "Enviando job..." : "Publicar job del canal"}
        </button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-slate-300">{value || "Pendiente"}</p>
    </div>
  );
}
