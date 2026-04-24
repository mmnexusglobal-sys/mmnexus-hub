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
}

export class BrandProfile {
  public settings: BrandSettings;

  constructor(settings: BrandSettings) {
    this.settings = settings;
  }

  public static loadDefault(): BrandProfile {
    return new BrandProfile({
      brandName: 'M&M Nexus',
      toneOfVoice: ['Futurista', 'Profesional'],
      forbiddenWords: ['barato', 'feo'],
      colorPalette: { primary: '#000000', secondary: '#ffffff', accent: '#ff003c' },
      typography: { heading: 'Inter', body: 'Roboto' }
    });
  }
}
