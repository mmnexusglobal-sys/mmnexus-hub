import { useState, useEffect } from "react";
import { getSavedDesigns, SavedDesign } from "@/lib/db";
import { Loader2, Image as ImageIcon, Search, Tag, Calendar, Database } from "lucide-react";

export default function Galeria() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    setLoading(true);
    const data = await getSavedDesigns();
    setDesigns(data);
    setLoading(false);
  };

  const filteredDesigns = designs.filter(d => 
    d.concept.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.shopifyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <header className="mb-8 shrink-0">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-emerald-400" />
          Galería Histórica (Base de Datos)
        </h2>
        <p className="text-slate-400">Todos los diseños e ideas que has generado, guardados de forma segura.</p>
      </header>

      <div className="relative mb-6 shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          placeholder="Buscar por concepto o título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Cargando diseños desde la base de datos...</p>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-dashed border-white/10 rounded-2xl">
            <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg">No se encontraron diseños.</p>
            <p className="text-sm mt-2">Prueba generando uno nuevo en el Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div key={design.id} className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all group flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-black/40">
                  <img 
                    src={design.imageUrl} 
                    alt={design.shopifyTitle} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {design.productType}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-200 line-clamp-2 mb-2 text-sm">
                    {design.shopifyTitle || "Sin título"}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1 italic">
                    "{design.concept}"
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-auto pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Tag className="w-3 h-3" />
                      {design.seoTags?.length || 0} tags
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
