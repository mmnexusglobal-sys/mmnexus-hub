"use client";

import { useState, useEffect } from "react";
import { BrandSettings } from "@mmnexus/core";
import { Save, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

export function BrandRulesConfig() {
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/brand')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white/2 border border-white/10 text-white rounded-2xl shadow-xl max-w-3xl mt-8 relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <ShieldCheck className="text-indigo-400 w-8 h-8" />
          Brand Guardian Rules
        </h2>
        <p className="text-slate-400 mb-8">
          Define la esencia y las reglas de marca. El <strong>BrandGuardianAgent</strong> utilizará esta configuración para validar todos los diseños, frases y copys generados por IA antes de su publicación automática.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium mb-2 text-slate-300">Nombre de la Marca</label>
            <input 
              id="brandName"
              type="text" 
              title="Nombre de la marca"
              placeholder="Ej: CyberNexus"
              value={settings.brandName}
              onChange={(e) => setSettings({...settings, brandName: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primaryColorText" className="block text-sm font-medium mb-2 text-slate-300">Color Primario (Hex)</label>
              <div className="flex items-center gap-3">
                <input 
                  id="primaryColorPicker"
                  aria-label="Selector de Color Primario"
                  type="color" 
                  value={settings.colorPalette.primary}
                  onChange={(e) => setSettings({
                    ...settings, 
                    colorPalette: { ...settings.colorPalette, primary: e.target.value }
                  })}
                  className="w-12 h-12 rounded-lg border-0 p-0 bg-transparent cursor-pointer"
                />
                <input 
                  id="primaryColorText"
                  type="text" 
                  title="Color primario en Hexadecimal"
                  placeholder="#000000"
                  value={settings.colorPalette.primary}
                  onChange={(e) => setSettings({
                    ...settings, 
                    colorPalette: { ...settings.colorPalette, primary: e.target.value }
                  })}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="accentColorText" className="block text-sm font-medium mb-2 text-slate-300">Color Acento (Hex)</label>
              <div className="flex items-center gap-3">
                <input 
                  id="accentColorPicker"
                  aria-label="Selector de Color Acento"
                  type="color" 
                  value={settings.colorPalette.accent}
                  onChange={(e) => setSettings({
                    ...settings, 
                    colorPalette: { ...settings.colorPalette, accent: e.target.value }
                  })}
                  className="w-12 h-12 rounded-lg border-0 p-0 bg-transparent cursor-pointer"
                />
                <input 
                  id="accentColorText"
                  type="text" 
                  title="Color de acento en Hexadecimal"
                  placeholder="#000000"
                  value={settings.colorPalette.accent}
                  onChange={(e) => setSettings({
                    ...settings, 
                    colorPalette: { ...settings.colorPalette, accent: e.target.value }
                  })}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="forbiddenWords" className="block text-sm font-medium mb-2 text-slate-300">Palabras Prohibidas (separadas por coma)</label>
            <textarea 
              id="forbiddenWords"
              value={settings.forbiddenWords.join(", ")}
              onChange={(e) => setSettings({
                ...settings, 
                forbiddenWords: e.target.value.split(",").map(w => w.trim())
              })}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white h-24 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
              placeholder="Ej. barato, oferta, de mala calidad, copia..."
            />
          </div>

          <div>
            <label htmlFor="toneOfVoice" className="block text-sm font-medium mb-2 text-slate-300">Tono de Voz</label>
            <textarea 
              id="toneOfVoice"
              value={settings.toneOfVoice.join(", ")}
              onChange={(e) => setSettings({
                ...settings, 
                toneOfVoice: e.target.value.split(",").map(w => w.trim())
              })}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white h-24 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
              placeholder="Ej. Futurista, directo, profesional..."
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-6">
            <div className="text-sm text-slate-400">
              Estas reglas se sincronizan automáticamente con el núcleo (@mmnexus/core).
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`font-medium py-3 px-6 rounded-xl flex items-center gap-2 transition-all ${
                success 
                  ? "bg-emerald-500 text-white" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
              }`}
            >
              {saving ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
              ) : success ? (
                <><CheckCircle2 className="w-5 h-5" /> ¡Sincronizado!</>
              ) : (
                <><Save className="w-5 h-5" /> Guardar y Sincronizar</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
