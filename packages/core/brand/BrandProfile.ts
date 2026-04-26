export interface BrandSettings {
  brandName: string;
  toneOfVoice: string[];
  forbiddenWords: string[];
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  platformGuidelines: {
    instagram: string;
    pinterest: string;
    tiktok: string;
  };
  coreMission: string;
}

export class BrandProfile {
  public settings: BrandSettings;

  constructor(settings: BrandSettings) {
    this.settings = settings;
  }

  public static loadDefault(): BrandProfile {
    return new BrandProfile({
      brandName: 'M&M Nexus',
      toneOfVoice: [
        'Innovador', 
        'Minimalista', 
        'Directo', 
        'Premium',
        'Vanguardista'
      ],
      forbiddenWords: ['barato', 'feo', 'descuento', 'ganga', 'compra ya'],
      colorPalette: { primary: '#0A0A0A', secondary: '#FAFAFA', accent: '#FF2A4D' },
      typography: { heading: 'Inter', body: 'Roboto' },
      coreMission: 'Crear piezas de Print-On-Demand que fusionan arte digital, tendencias futuristas y calidad premium.',
      platformGuidelines: {
        instagram: 'Tono editorial y aspiracional. Enfoque en estilo de vida (lifestyle). Usar emojis sutiles y elegantes (✨, ⚡, 🖤). Fomentar el guardado y compartido.',
        pinterest: 'Tono inspiracional y descriptivo. Enfoque 100% en palabras clave de búsqueda (aesthetic, outfit ideas, streetwear inspiration). Lenguaje directo al valor visual.',
        tiktok: 'Tono súper nativo y hook-first. Hablar en primera persona o formato POV. Texto corto, misterioso o impactante. Impulsar a la acción inmediata.'
      }
    });
  }
}
