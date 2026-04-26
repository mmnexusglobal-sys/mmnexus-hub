"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Loader2, RefreshCw, Layers, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      if (!db) {
        console.warn("Firebase DB no inicializada");
        return;
      }
      const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    } catch (error) {
      console.error("Error al cargar campañas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="text-indigo-400" /> Campañas Activas
          </h2>
          <p className="text-slate-400 text-sm mt-1">Supervisa y valida los contenidos generados por los Agentes IA.</p>
        </div>
        <button 
          onClick={fetchCampaigns}
          className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors border border-white/10"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center text-slate-400">
          No hay campañas registradas todavía. ¡Aprueba tu primer diseño!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {/* Encabezado de Campaña */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-4">
                  {camp.imageUrl ? (
                    <img src={camp.imageUrl} alt={camp.niche} className="w-12 h-12 rounded object-cover border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{camp.niche || 'Diseño sin nombre'}</h3>
                    <p className="text-xs text-slate-400">ID: {camp.id} • {new Date(camp.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase rounded border border-emerald-500/20">
                  {camp.status}
                </div>
              </div>

              {/* Assets Sociales */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Instagram */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                  <h4 className="font-semibold text-pink-400 mb-3 flex items-center justify-between">
                    Instagram 1:1
                    {camp.socialAssets?.instagram && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </h4>
                  {camp.socialAssets?.instagram ? (
                    <div className="space-y-3">
                      <img src={camp.socialAssets.instagram.images[0]} className="w-full aspect-square object-cover rounded-lg" alt="IG Mockup" />
                      <p className="text-xs text-slate-300 line-clamp-3 bg-black/30 p-2 rounded">{camp.socialAssets.instagram.caption}</p>
                      <div className="flex flex-wrap gap-1">
                        {camp.socialAssets.instagram.hashtags.map((h: string, i: number) => (
                          <span key={i} className="text-[10px] text-pink-300 bg-pink-500/10 px-1.5 py-0.5 rounded">{h}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Pendiente de generación...</p>
                  )}
                </div>

                {/* Pinterest */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                  <h4 className="font-semibold text-red-400 mb-3 flex items-center justify-between">
                    Pinterest 2:3
                    {camp.socialAssets?.pinterest && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </h4>
                  {camp.socialAssets?.pinterest ? (
                    <div className="space-y-3">
                      <img src={camp.socialAssets.pinterest.imageUri} className="w-full aspect-[2/3] object-cover rounded-lg" alt="Pin Mockup" />
                      <div>
                        <p className="text-sm font-bold text-slate-200">{camp.socialAssets.pinterest.title}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-3">{camp.socialAssets.pinterest.description}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Pendiente de generación...</p>
                  )}
                </div>

                {/* TikTok */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                  <h4 className="font-semibold text-cyan-400 mb-3 flex items-center justify-between">
                    TikTok 9:16
                    {camp.socialAssets?.tiktok && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </h4>
                  {camp.socialAssets?.tiktok ? (
                    <div className="space-y-3">
                      <img src={camp.socialAssets.tiktok.videoOrImageUri} className="w-full aspect-[9/16] object-cover rounded-lg" alt="TikTok Cover" />
                      <div className="bg-black/30 p-2 rounded">
                        <p className="text-xs text-slate-300 mb-1 font-semibold">{camp.socialAssets.tiktok.caption}</p>
                        <p className="text-[10px] text-cyan-300">🎵 {camp.socialAssets.tiktok.suggestedAudio}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Pendiente de generación...</p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
