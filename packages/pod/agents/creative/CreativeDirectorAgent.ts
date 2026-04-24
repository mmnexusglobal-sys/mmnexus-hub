import { BaseAgent } from '@mmnexus/core';

export interface DesignBrief {
  trendContext: any;
  conceptName: string;
  suggestedPhrases: string[];
  visualStyleParams: {
    colorMood: string;
    complexity: 'minimalist' | 'detailed' | 'abstract';
  };
}

export class CreativeDirectorAgent extends BaseAgent {
  constructor() {
    super('CreativeDirector');
  }

  public async execute(trendData: any): Promise<DesignBrief> {
    this.log('Analizando reporte de tendencias para generar brief creativo...');

    const brief: DesignBrief = {
      trendContext: trendData,
      conceptName: `Cyberpunk ${trendData?.topNiches?.[0] || 'Aesthetic'}`,
      suggestedPhrases: [
        'Code is Poetry',
        'Future is Now',
        'Syntax Error: Coffee Not Found'
      ],
      visualStyleParams: {
        colorMood: 'Neon, high contrast, dark background',
        complexity: 'detailed'
      }
    };

    this.log(`Brief creado para concepto: ${brief.conceptName}`);
    this.eventBus.emit('creative:brief-ready', brief);

    return brief;
  }
}
