"use client";

import { useState, useEffect } from "react";
import { 
  Wand2, Image as ImageIcon, Send, Share2, ShoppingBag, 
  Settings, LayoutDashboard, Shirt, RefreshCw, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [concept, setConcept] = useState("");
  const [decision, setDecision] = useState<any>(null);
  const [printifyStatus, setPrintifyStatus] = useState<{ connected: boolean; shopName?: string; loading: boolean }>({ connected: false, loading: true });

  useEffect(() => {
    fetch("/api/printify/shops")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPrintifyStatus({ connected: true, shopName: data[0].title, loading: false });
        } else {
          setPrintifyStatus({ connected: false, loading: false });
        }
      })
      .catch(() => setPrintifyStatus({ connected: false, loading: false }));
  }, []);

  const handleGenerate = async () => {
    if (!concept) return;
    setIsGenerating(true);
    setDecision(null);
    try {
      const res = await fetch("/api/ai/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept }),
      });
      const data = await res.json();
      setDecision(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-slate-950 flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">MMNexus</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: ImageIcon, label: "Generador IA", active: false },
            { icon: Shirt, label: "Printify Products", active: false },
            { icon: ShoppingBag, label: "E-Commerce", active: false },
            { icon: Share2, label: "Redes Sociales", active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="pt-6 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configuración</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Workspace Central</h2>
            <p className="text-slate-400">Automatiza la creación y distribución de tus productos.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema en línea
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - AI Generator */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-400" />
                Agente Decisor: Producto y Copy
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Area */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-300 mb-2">Concepto o Nicho de Diseño</label>
                  <textarea 
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="Ej. Gatos samurai cyberpunk en Tokyo..."
                    className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors mb-4"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !concept}
                    className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    {isGenerating ? "Procesando Nicho..." : "Analizar con IA"}
                  </button>
                </div>

                {/* AI Output Area */}
                <div className="flex flex-col">
                  <div className="flex-1 bg-slate-900/50 border border-indigo-500/20 rounded-xl p-4 text-sm text-slate-300 relative overflow-y-auto max-h-[300px]">
                    {decision ? (
                      decision.error ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-red-400 p-4">
                          <AlertCircle className="w-8 h-8 mb-2" />
                          <p className="font-semibold mb-2">Error en la API</p>
                          <p className="text-xs break-all">{decision.error}</p>
                          {decision.rawOutput && (
                            <pre className="mt-4 text-[10px] bg-black/40 p-2 rounded text-left w-full overflow-x-auto text-slate-400">
                              {decision.rawOutput}
                            </pre>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                            <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-1 block">Producto Sugerido</span>
                            <span className="font-medium text-white">{decision.productType} (Blueprint: {decision.blueprintId})</span>
                            <p className="text-xs text-slate-400 mt-1">{decision.reason}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1 block">Título Shopify</span>
                            <span className="font-medium">{decision.shopifyTitle}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1 block">Copy Redes Sociales</span>
                            <p className="text-slate-300 whitespace-pre-wrap">{decision.socialCopy}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {decision.seoTags?.map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded-full border border-white/10 text-slate-400">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Wand2 className="w-8 h-8 mb-2" />
                        <p>Esperando análisis de Gemma AI...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: "1. Printify API", desc: "Crear Producto", active: true, icon: Shirt },
                { step: "2. Shopify", desc: "Sync Inventario", active: false, icon: ShoppingBag },
                { step: "3. Redes Sociales", desc: "Publicar Post", active: false, icon: Share2 }
              ].map((step, i) => (
                <div key={i} className={`bg-white/[0.02] border border-white/10 rounded-xl p-5 ${step.active ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : ''}`}>
                  <step.icon className={`w-6 h-6 mb-3 ${step.active ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <h4 className="font-semibold text-slate-200 mb-1">{step.step}</h4>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button className="bg-white text-slate-950 font-bold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-slate-200 transition-colors">
                <Send className="w-4 h-4" />
                Ejecutar Pipeline
              </button>
            </div>
          </div>

          {/* Right Column - Integrations */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-4">Integraciones</h3>
            
            <div className="space-y-4">
              {/* Integration Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#39b75d]/20 flex items-center justify-center">
                    <Shirt className="w-5 h-5 text-[#39b75d]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Printify</h4>
                    {printifyStatus.loading ? (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Loader2 className="w-3 h-3 animate-spin" /> Verificando...
                      </p>
                    ) : printifyStatus.connected ? (
                      <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> {printifyStatus.shopName}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> Error de conexión
                      </p>
                    )}
                  </div>
                </div>
                <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Configurar</button>
              </div>

              {/* Integration Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#95bf47]/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#95bf47]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Shopify</h4>
                    <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Pendiente
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Conectar</button>
              </div>

              {/* Instagram Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Instagram & FB</h4>
                    <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Pendiente OAuth
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Conectar</button>
              </div>

              {/* TikTok Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">TikTok</h4>
                    <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Pendiente API
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Conectar</button>
              </div>

              {/* Pinterest Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Pinterest</h4>
                    <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Pendiente API
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Conectar</button>
              </div>
              
              {/* Google Drive Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Google Drive</h4>
                    <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Pendiente API
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Conectar</button>
              </div>

              {/* Email Reports Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Reporte Semanal</h4>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> mmnexusglobal@gmail.com
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Editar</button>
              </div>
            </div>

            <div className="mt-8 bg-linear-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wand2 className="w-24 h-24" />
              </div>
              <h4 className="font-semibold text-indigo-300 mb-2">Gemma AI Studio</h4>
              <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                Tu asistente IA está listo para analizar imágenes y generar descripciones optimizadas para SEO y redes sociales.
              </p>
              <div className="text-xs bg-black/40 text-slate-300 px-3 py-1.5 rounded-md inline-block border border-white/5">
                Modelo: gemma4
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
