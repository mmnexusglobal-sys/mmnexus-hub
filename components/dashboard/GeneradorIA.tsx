import { useState } from "react";
import { Image as ImageIcon, Sparkles, Loader2, Download, CheckCircle2 } from "lucide-react";

export default function GeneradorIA({ decision }: { decision: any }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setImageUrl(null);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al generar la imagen");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToPrintify = async () => {
    if (!imageUrl || !decision) {
      alert("Necesitas generar una imagen y tener una decisión de diseño previa.");
      return;
    }
    
    setIsPublishing(true);
    try {
      const res = await fetch("/api/printify/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...decision, imageUrl }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert("¡Éxito! Producto creado en Printify.");
      } else {
        alert("Error de Printify: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error crítico al subir a Printify.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-indigo-400" />
          Arquitecto Visual
        </h2>
        <p className="text-slate-400">Genera artes finales para Printify usando Imagen 4.0 de Google.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Prompt de Diseño (Visual-Generator)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            placeholder="Ej: Un perro astronauta flotando en el espacio profundo con estilo pop art brillante, colores neón, aislado sobre fondo transparente."
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className={`w-full mt-4 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              !prompt || isGenerating
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            }`}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? "Renderizando Imagen 4.0..." : "Generar Arte"}
          </button>

          <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Especificaciones POD
            </h4>
            <ul className="text-xs text-slate-400 space-y-1 ml-6 list-disc">
              <li>Resolución: 4096 x 4096 px</li>
              <li>Calidad: 300 DPI</li>
              <li>Fondo: Automáticamente aislado</li>
              <li>Modelo: google/imagen-4.0-generate-001</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center justify-center min-h-[400px]">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-indigo-400 animate-pulse">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="font-medium">El Arquitecto Visual está trabajando...</p>
            </div>
          ) : imageUrl ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50 mb-4 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Generated Art" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                    Descargar Asset
                  </button>
                </div>
              </div>
              <button 
                onClick={handlePublishToPrintify}
                disabled={isPublishing}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  isPublishing 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                }`}
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isPublishing ? "Publicando en Printify..." : "Aprobar para Printify"}
              </button>
            </div>
          ) : (
            <div className="text-center opacity-30">
              <ImageIcon className="w-16 h-16 mx-auto mb-4" />
              <p>El lienzo está en blanco.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
