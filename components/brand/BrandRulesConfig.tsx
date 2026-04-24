'use client';

import { useState } from 'react';

export function BrandRulesConfig() {
  const [brandName, setBrandName] = useState('M&M Nexus');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [tone, setTone] = useState('Futurista, profesional, disruptivo');

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg max-w-2xl mt-8">
      <h2 className="text-2xl font-bold mb-4">🛡️ Brand Guardian Rules</h2>
      <p className="text-gray-400 mb-6">Define las reglas de marca que los agentes creativos y de redes sociales deberán respetar.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre de Marca</label>
          <input 
            type="text" 
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color Principal (Hex)</label>
          <div className="flex items-center gap-3">
            <input 
              type="color" 
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded border-0 p-0 bg-transparent cursor-pointer"
            />
            <input 
              type="text" 
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tono de Voz</label>
          <textarea 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white h-24"
            placeholder="Ej. Cercano, profesional, vanguardista..."
          />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors w-full mt-4">
          Guardar Reglas de Marca
        </button>
      </div>
    </div>
  );
}
