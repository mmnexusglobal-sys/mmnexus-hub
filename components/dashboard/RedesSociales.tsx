import { useState } from "react";
import { Share2, Camera, Music2, MapPin, Hash, CheckCircle2, Loader2, Video } from "lucide-react";

export default function RedesSociales({ decision, imageUrl }: { decision: any, imageUrl: string | null }) {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPublishingLoading, setIsPublishingLoading] = useState(false);
  const [isPublishingIg, setIsPublishingIg] = useState(false);
  
  // Nivel V2: Mockups Lifestyle
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);

  const handlePublishIG = async () => {
    setIsPublishingLoading(true);
    try {
      const tags = decision.seoTags || ["streetwear", "design", "art"];
      const formattedTags = tags.map((t: string) => `#${t.replace(/\s+/g, '')}`).join(" ");
      const finalCopy = `${decision.socialCopy}\n\n${formattedTags}`;
      
      const finalImageUrl = mockupUrl || imageUrl;

      const res = await fetch("/api/social/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          socialCopy: finalCopy,
          productType: decision.productType || "Diseño",
          platform: "Instagram"
        }),
      });

      if (res.ok) {
        setIsPublishingIg(true);
      } else {
        alert("Error al enviar a Make.com: " + res.statusText);
      }
    } catch (error) {
      console.error(error);
      alert("Fallo de conexión con el Webhook.");
    } finally {
      setIsPublishingLoading(false);
    }
  };

  const handleGenerateMockup = async () => {
    setIsGeneratingMockup(true);
    // Simulamos una llamada a la API de Photoroom o Printify Mockups
    setTimeout(() => {
      // Usamos una imagen lifestyle urbana de alta calidad como placeholder del mockup generado
      setMockupUrl("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80");
      setIsGeneratingMockup(false);
    }, 2500);
  };

  if (!decision || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <Share2 className="w-16 h-16 opacity-20" />
        <p className="text-lg">No hay ningún producto generado.</p>
        <p className="text-sm">Ve al Dashboard o al Generador IA para crear un nuevo diseño primero.</p>
      </div>
    );
  }

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    try {
      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, socialCopy: decision.socialCopy }),
      });
      const data = await res.json();
      if (data.success) {
        setVideoUrl(data.videoUrl);
      } else {
        alert("Error generando el video: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Fallo de conexión al generar video.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const socialCopy = decision.socialCopy || "¡Nuevo diseño disponible en MMNexus!";
  const tags = decision.seoTags || ["streetwear", "design", "art"];
  const formattedTags = tags.map((t: string) => `#${t.replace(/\s+/g, '')}`).join(" ");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Share2 className="w-8 h-8 text-pink-400" />
          Agente de Redes Sociales
        </h2>
        <p className="text-slate-400">Distribución automática de contenido y mockups promocionales.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column - Preview */}
        <div className="w-full lg:w-1/3 space-y-6 shrink-0">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Asset Principal
            </h3>
            
            <div className="w-full max-h-[400px] flex items-center justify-center rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-4 relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={mockupUrl || imageUrl} 
                alt="Generated Art" 
                className={`w-full h-full object-contain transition-all duration-500 ${isGeneratingMockup ? 'blur-sm opacity-50' : ''}`} 
              />
              {isGeneratingMockup && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-2" />
                  <p className="text-xs text-pink-400 font-bold bg-black/50 px-3 py-1 rounded-full">Renderizando Photoroom...</p>
                </div>
              )}
            </div>
            
            {mockupUrl ? (
              <div className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Mockup Lifestyle Listo
              </div>
            ) : (
              <button 
                onClick={handleGenerateMockup}
                disabled={isGeneratingMockup}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 py-3 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingMockup ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                {isGeneratingMockup ? "Procesando..." : "Generar Mockups 3D Lifestyle"}
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Social Channels */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {/* Instagram Post */}
          <div className="bg-linear-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-pink-500 text-white p-2 rounded-full shadow-lg shadow-pink-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-pink-100 mb-4 flex items-center gap-2">
              Post para Instagram {mockupUrl && <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20">Modo Pro</span>}
            </h3>
            
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-slate-300 whitespace-pre-wrap">{socialCopy}</p>
              <p className="text-pink-400 font-medium mt-3">{formattedTags}</p>
            </div>

            <div className="flex gap-4">
              {isPublishingIg ? (
                <div className="w-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> ¡Publicado en Instagram!
                </div>
              ) : (
                <>
                  <button 
                    onClick={handlePublishIG}
                    disabled={isPublishingLoading}
                    className="flex-1 bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20 flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isPublishingLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isPublishingLoading ? "Enviando a API..." : (mockupUrl ? "Publicar Mockup Ahora" : "Publicar Diseño Ahora")}
                  </button>
                  <button className="flex-1 bg-white/10 text-slate-200 font-medium py-3 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50" disabled={isPublishingLoading}>
                    Programar...
                  </button>
                </>
              )}
            </div>
          </div>

          {/* TikTok Script & Video Generator */}
          <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-cyan-500 text-white p-2 rounded-full shadow-lg shadow-cyan-500/30">
              <Music2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-cyan-100 mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              TikTok & Reels (Video Generativo)
            </h3>
            
            {!videoUrl ? (
              <>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3 mb-4">
                  <p className="text-sm text-slate-400"><span className="text-cyan-400 font-bold">Hook (0-3s):</span> {decision.socialCopy ? `Muestra la imagen tapada y di "${decision.socialCopy.split('.')[0]}..."` : 'Muestra la imagen tapada y di "No vas a creer el diseño que acabo de crear..."'}</p>
                  <p className="text-sm text-slate-400"><span className="text-cyan-400 font-bold">Body (3-10s):</span> Revela el diseño al ritmo del beat de tendencia actual.</p>
                  <p className="text-sm text-slate-400"><span className="text-cyan-400 font-bold">CTA (10-15s):</span> "Link in bio to get yours before it sells out!"</p>
                </div>
                
                <button 
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo}
                  className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold py-3 rounded-xl hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                  {isGeneratingVideo ? "Renderizando Video (Creatomate)..." : "Auto-Generar Video MP4"}
                </button>
              </>
            ) : (
              <div className="bg-black/60 rounded-xl border border-emerald-500/30 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                <div>
                  <h4 className="text-emerald-300 font-bold">¡Video Renderizado!</h4>
                  <p className="text-sm text-slate-400">El MP4 está listo para publicarse en TikTok.</p>
                </div>
                {/* Mock preview of a video link */}
                <a href={videoUrl} target="_blank" rel="noreferrer" className="text-sm text-cyan-400 underline mt-2 break-all">
                  {videoUrl}
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Re-export icon locally inside file since we need it in the middle of code
function ImageIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
}
