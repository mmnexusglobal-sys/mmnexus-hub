import { Share2, Camera, Music2, MapPin, Hash, CheckCircle2 } from "lucide-react";

export default function RedesSociales({ decision, imageUrl }: { decision: any, imageUrl: string | null }) {
  if (!decision || !imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <Share2 className="w-16 h-16 opacity-20" />
        <p className="text-lg">No hay ningún producto generado.</p>
        <p className="text-sm">Ve al Dashboard o al Generador IA para crear un nuevo diseño primero.</p>
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Asset Principal
            </h3>
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/50 border border-white/10 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Generated Art" className="w-full h-full object-contain" />
            </div>
            
            <button className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white py-3 rounded-xl font-medium transition-colors border border-white/5">
              Generar Mockups 3D (Próximamente)
            </button>
          </div>
        </div>

        {/* Right Column - Social Channels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Instagram Post */}
          <div className="bg-linear-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-pink-500 text-white p-2 rounded-full shadow-lg shadow-pink-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-pink-100 mb-4">Post para Instagram</h3>
            
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4">
              <p className="text-slate-300 whitespace-pre-wrap">{socialCopy}</p>
              <p className="text-pink-400 font-medium mt-3">{formattedTags}</p>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20">
                Publicar Ahora
              </button>
              <button className="flex-1 bg-white/10 text-slate-200 font-medium py-3 rounded-xl hover:bg-white/20 transition-colors">
                Programar...
              </button>
            </div>
          </div>

          {/* TikTok Script */}
          <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-cyan-500 text-white p-2 rounded-full shadow-lg shadow-cyan-500/30">
              <Music2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-cyan-100 mb-4">Guion para TikTok (Copywriter-Pro)</h3>
            
            <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
              <p className="text-sm text-slate-400"><span className="text-cyan-400 font-bold">Hook (0-3s):</span> Muestra la imagen tapada y di "No vas a creer el diseño que acabo de crear con IA para mi tienda..."</p>
              <p className="text-sm text-slate-400"><span className="text-cyan-400 font-bold">Body (3-10s):</span> Revela el diseño al ritmo del beat. "Literalmente es un perro astronauta. Lo subí a Printify en 10 segundos".</p>
              <p className="text-sm text-slate-400"><span className="text-cyan-400 font-bold">CTA (10-15s):</span> "Link en la bio si quieres llevártelo antes de que se agote."</p>
            </div>
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
