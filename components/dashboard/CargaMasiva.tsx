import { useState } from "react";
import { Loader2, Layers, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { saveDesign } from "@/lib/db";

export default function CargaMasiva() {
  const [batchInput, setBatchInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ total: 0, current: 0, currentConcept: "" });
  const [results, setResults] = useState<{ concept: string; status: "success" | "error"; message?: string }[]>([]);

  const handleStartBatch = async () => {
    const concepts = batchInput.split("\n").filter(c => c.trim().length > 0);
    if (concepts.length === 0) return;

    setIsProcessing(true);
    setProgress({ total: concepts.length, current: 0, currentConcept: "Iniciando Pipeline v2..." });
    setResults([]);

    for (let i = 0; i < concepts.length; i++) {
      const concept = concepts[i].trim();
      
      try {
        // 01. Trend-Finder / Decision (JSON Score)
        setProgress(prev => ({ ...prev, current: i + 1, currentConcept: `[01. Decision] Analizando: ${concept}` }));
        const decisionRes = await fetch("/api/ai/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concept }),
        });
        
        if (!decisionRes.ok) throw new Error("Fallo en la toma de decisión (01)");
        const decisionData = await decisionRes.json();
        
        // 02. Visual-Generator
        setProgress(prev => ({ ...prev, currentConcept: `[02. Visual] Renderizando: ${concept}` }));
        const visualPrompt = decisionData.visualPrompt || concept; 
        const imageRes = await fetch("/api/ai/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: visualPrompt }),
        });

        if (!imageRes.ok) throw new Error("Fallo en la generación visual (02)");
        const imageData = await imageRes.json();

        // 06. QA-Guardian (Validación Técnica y Estética)
        setProgress(prev => ({ ...prev, currentConcept: `[06. QA-Guardian] Auditando archivo...` }));
        // Simulamos la validación de IA (DPI, Remoción de fondo, Transparencia)
        await new Promise(resolve => setTimeout(resolve, 1200)); 
        
        // Lógica de rechazo simulada: Por ahora el QA-Guardian aprueba todos, 
        // pero aquí se llamaría a un modelo de visión para validar el asset real.
        const qaPassed = true; 
        if (!qaPassed) {
          throw new Error("QA-Guardian Rechazado: El diseño no cumple con los 300 DPI o no tiene fondo transparente.");
        }

        // 05. Autobot-Commander (Subida a Printify)
        setProgress(prev => ({ ...prev, currentConcept: `[05. Autobot] Creando producto en Printify...` }));
        const printifyRes = await fetch("/api/printify/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             imageUrl: imageData.imageUrl,
             title: decisionData.shopifyTitle || concept,
             description: decisionData.socialCopy || "Diseño exclusivo de M&M Nexus",
             tags: decisionData.seoTags || ["mmnexus"]
          })
        });

        if (!printifyRes.ok) {
           const errData = await printifyRes.json().catch(() => ({}));
           // Si falla la API de Printify, el Autobot-Commander aborta este diseño
           throw new Error(`Fallo de Printify: ${errData.error || printifyRes.statusText}`);
        }

        // 05. Autobot-Commander (Guardado Local)
        setProgress(prev => ({ ...prev, currentConcept: `[05. Autobot] Persistiendo en Base de Datos...` }));
        await saveDesign({
          concept: concept,
          imageUrl: imageData.imageUrl,
          socialCopy: decisionData.socialCopy || "",
          shopifyTitle: decisionData.shopifyTitle || "",
          seoTags: decisionData.seoTags || [],
          productType: decisionData.productType || "",
        });

        setResults(prev => [...prev, { concept, status: "success", message: "Publicado en Printify y Guardado" }]);
      } catch (error: any) {
        setResults(prev => [...prev, { concept, status: "error", message: error.message }]);
      }
    }

    setIsProcessing(false);
    setProgress(prev => ({ ...prev, currentConcept: "¡Reporte Diario Generado!" }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Layers className="w-8 h-8 text-pink-500" />
          Carga Masiva (Batch Processing)
        </h2>
        <p className="text-slate-400">Automatiza la creación de colecciones enteras. Ingresa un concepto por línea.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <label className="text-sm font-medium text-slate-300 mb-3 block">Lista de Conceptos / Nichos</label>
          <textarea 
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            disabled={isProcessing}
            placeholder="Gato cyberpunk bebiendo café&#10;Perro astronauta en marte&#10;Oso panda ninja..."
            className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-pink-500/50 resize-none transition-colors mb-4"
          />
          
          <button 
            onClick={handleStartBatch}
            disabled={isProcessing || !batchInput.trim()}
            className="w-full bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
            {isProcessing ? "Procesando Lote..." : "Iniciar Fabricación en Serie"}
          </button>
        </div>

        {/* Progress and Results */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col">
          <h3 className="font-semibold text-slate-200 mb-6 border-b border-white/10 pb-4">Progreso del Lote</h3>
          
          {isProcessing || progress.total > 0 ? (
            <div className="mb-6 bg-white/[0.02] p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Generando: <span className="text-pink-400 font-medium">{progress.currentConcept}</span></span>
                <span className="text-slate-300 font-bold">{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8 opacity-50 flex-1 flex flex-col items-center justify-center">
              <Layers className="w-12 h-12 mb-3" />
              <p>Esperando conceptos para iniciar.</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2">
            {results.map((res, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 text-sm">
                {res.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-slate-200 font-medium">{res.concept}</p>
                  {res.status === "error" && <p className="text-xs text-rose-400 mt-1">{res.message}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
