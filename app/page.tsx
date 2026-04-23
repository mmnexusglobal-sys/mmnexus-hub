"use client";

import { useState, useEffect } from "react";

import { 
  Wand2, Image as ImageIcon, Send, Share2, ShoppingBag, 
  Settings, LayoutDashboard, Shirt, RefreshCw, CheckCircle2, AlertCircle, Loader2, Database, Layers
} from "lucide-react";
import GeneradorIA from "@/components/dashboard/GeneradorIA";
import RedesSociales from "@/components/dashboard/RedesSociales";
import Galeria from "@/components/dashboard/Galeria";
import CargaMasiva from "@/components/dashboard/CargaMasiva";

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

import { DecisionData } from "@/lib/validations";

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [concept, setConcept] = useState("");
  const [reportText, setReportText] = useState("");
  const [isProcessingTrends, setIsProcessingTrends] = useState(false);
  const [decision, setDecision] = useState<DecisionData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [printifyStatus, setPrintifyStatus] = useState<{ connected: boolean; shopName?: string; loading: boolean }>({ connected: false, loading: true });
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [pipelineExecuting, setPipelineExecuting] = useState(false);

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

  const handleExecutePipeline = async () => {
    if (!decision) return;
    setPipelineExecuting(true);
    try {
      const res = await fetch("/api/printify/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...decision, imageUrl }),
      });
      const data = await res.json();
      if (data.success) {
        alert("¡Pipeline Ejecutado! Producto creado en Printify.");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al ejecutar el pipeline");
    } finally {
      setPipelineExecuting(false);
    }
  };

  const handleProcessTrends = async () => {
    if (!reportText) return;
    setIsProcessingTrends(true);
    try {
      const res = await fetch("/api/ai/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText }),
      });
      const data = await res.json();
      if (data.success) {
        alert("¡Tendencias actualizadas y guardadas con éxito!");
        setReportText(""); // Clear after success
      } else {
        alert("Error al procesar: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar tendencias");
    } finally {
      setIsProcessingTrends(false);
    }
  };

  const handleGenerate = async () => {
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
      if (!data.error) {
        setActiveTab("Generador IA");
      }
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
          <span className="font-bold text-xl tracking-tight">MMNexus</span>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <SidebarItem icon={<ImageIcon />} label="Generador IA" active={activeTab === "Generador IA"} onClick={() => setActiveTab("Generador IA")} />
          <SidebarItem icon={<Database />} label="Galeria" active={activeTab === "Galeria"} onClick={() => setActiveTab("Galeria")} />
          <SidebarItem icon={<Shirt />} label="Printify Products" active={activeTab === "Printify Products"} onClick={() => setActiveTab("Printify Products")} />
          <SidebarItem icon={<ShoppingBag />} label="E-Commerce" active={activeTab === "E-Commerce"} onClick={() => setActiveTab("E-Commerce")} />
          
          <div className="mt-8 mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agentes</span>
          </div>
          <SidebarItem icon={<Layers />} label="Carga Masiva" active={activeTab === "Carga Masiva"} onClick={() => setActiveTab("Carga Masiva")} />
          <SidebarItem icon={<Share2 />} label="Redes Sociales" active={activeTab === "Redes Sociales"} onClick={() => setActiveTab("Redes Sociales")} />
          <SidebarItem icon={<Settings />} label="Configuracion" active={activeTab === "Configuracion"} onClick={() => setActiveTab("Configuracion")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
        
        {activeTab === "Generador IA" ? (
          <GeneradorIA decision={decision} imageUrl={imageUrl} setImageUrl={setImageUrl} />
        ) : activeTab === "Redes Sociales" ? (
          <RedesSociales decision={decision} imageUrl={imageUrl} />
        ) : activeTab === "Carga Masiva" ? (
          <CargaMasiva />
        ) : activeTab === "Galeria" ? (
          <Galeria />
        ) : activeTab === "Dashboard" ? (
          <>
            <header className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-3xl font-bold mb-2">MMNexus Hub</h1>
                <p className="text-slate-400">Automatización Print On Demand & E-Commerce AI</p>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center gap-4 bg-white/2 border border-white/10 rounded-full px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </div>
                  <span className="text-sm font-medium text-slate-300">Gemma 4 Activa</span>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  {printifyStatus.loading ? (
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  ) : printifyStatus.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span className="text-sm font-medium text-slate-300">
                    {printifyStatus.loading ? "Conectando Printify..." : printifyStatus.shopName || "Printify"}
                  </span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column - AI Generator */}
              <div className="xl:col-span-2 space-y-8">
                
                {/* Trend Ingestion Form */}
                <div className="bg-white/2 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
                  
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <Database className="text-emerald-400" />
                    Procesador de Tendencias Diarias
                  </h3>
                  
                  <div className="flex flex-col gap-4 relative z-10">
                    <label className="text-sm font-medium text-slate-300 block">Pega el reporte en texto de tu analista aquí:</label>
                    <textarea 
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      placeholder="Ej. 'Hoy detectamos una subida del 120% en Pinterest sobre el diseño eco-futurista...'"
                      className="w-full h-28 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none transition-colors"
                    />
                    <button 
                      onClick={handleProcessTrends}
                      disabled={isProcessingTrends || !reportText}
                      className="self-end bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 font-medium py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessingTrends ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                      {isProcessingTrends ? "Estructurando JSON..." : "Procesar y Guardar Tendencias"}
                    </button>
                  </div>
                </div>

                {/* Concept Input Section */}
                <div className="bg-white/2 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
                
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <Wand2 className="text-indigo-400" />
                  Agente Decisor: Producto y Copy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {/* Input Area */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">Concepto o Nicho de Diseño</label>
                      <textarea 
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="Ej. Gatos samurai cyberpunk en Tokyo..."
                        className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
                      />
                    </div>
                    
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !concept}
                      className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    {isGenerating ? "Procesando..." : "Analizar con IA (Usa Tendencias Guardadas)"}
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
                <div key={i} className={`bg-white/2 border border-white/10 rounded-xl p-5 ${step.active ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : ''}`}>
                  <step.icon className={`w-6 h-6 mb-3 ${step.active ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <h4 className="font-semibold text-slate-200 mb-1">{step.step}</h4>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={handleExecutePipeline}
                disabled={!decision || pipelineExecuting}
                className={`font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors ${
                  !decision || pipelineExecuting 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                    : "bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                }`}
              >
                {pipelineExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {pipelineExecuting ? "Ejecutando..." : "Ejecutar Pipeline"}
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
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            En construcción...
          </div>
        )}
      </main>
    </div>
  );
}
