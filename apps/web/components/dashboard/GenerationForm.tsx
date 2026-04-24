'use client';

import { useState } from 'react';

type PipelineResult = {
  trend: {
    topNiches: string[];
  };
  brief: {
    conceptName: string;
  };
  instagramPost: {
    caption: string;
    hashtags: string[];
  };
};

export function GenerationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runPipeline = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandRules: {
            brandName: 'M&M Nexus',
            toneOfVoice: ['Futurista', 'Profesional'],
            forbiddenWords: ['barato', 'feo'],
            colorPalette: { primary: '#000000', secondary: '#ffffff', accent: '#ff003c' },
            typography: { heading: 'Inter', body: 'Roboto' }
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Error desconocido');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg mt-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">🚀 Lanzar Pipeline de Generación</h2>
      <p className="text-gray-400 mb-6">
        Este botón activa el <span className="font-semibold text-blue-400">Nexus Orchestrator</span>. 
        Ejecutará la búsqueda de tendencias, creación visual, revisión de marca y formateo para Instagram.
      </p>

      <button
        onClick={runPipeline}
        disabled={loading}
        className={`w-full py-3 px-4 rounded font-bold text-white transition-all ${
          loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-linear-to-r from-blue-600 to-purple-600 hover:scale-105'
        }`}
      >
        {loading ? 'Ejecutando Agentes...' : 'Iniciar Creación Mágica ✨'}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded overflow-auto max-h-96">
          <h3 className="text-lg font-bold text-green-400 mb-2">✅ ¡Pipeline Exitoso!</h3>
          <p className="mb-2 text-sm text-gray-300"><strong>Tendencia encontrada:</strong> {result.trend.topNiches[0]}</p>
          <p className="mb-2 text-sm text-gray-300"><strong>Concepto Creativo:</strong> {result.brief.conceptName}</p>
          <div className="mt-4 bg-black p-4 rounded border border-gray-700">
            <h4 className="font-bold mb-2">📱 Post de Instagram Generado:</h4>
            <p className="text-sm whitespace-pre-wrap">{result.instagramPost.caption}</p>
            <p className="text-sm text-blue-400 mt-2">{result.instagramPost.hashtags.join(' ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
