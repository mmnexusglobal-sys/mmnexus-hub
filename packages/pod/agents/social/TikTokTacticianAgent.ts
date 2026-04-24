import { BaseAgent } from '@mmnexus/core';

export interface TikTokVideoParams {
  baseAssetUri: string;
  concept: string;
  targetAudience: string;
}

export interface TikTokPost {
  format: '9:16';
  videoOrImageUri: string;
  caption: string;
  suggestedAudio: string;
  hashtags: string[];
}

export class TikTokTacticianAgent extends BaseAgent {
  constructor() {
    super('TikTokTactician');
  }

  public async execute(params: TikTokVideoParams): Promise<TikTokPost> {
    this.log(`Adaptando contenido para TikTok, formato 9:16: ${params.concept}`);
    
    const caption = `POV: Encontraste el diseño perfecto de ${params.concept}. 🔥\n\nLink en bio.`;
    
    const postData: TikTokPost = {
      format: '9:16',
      videoOrImageUri: params.baseAssetUri, 
      caption,
      suggestedAudio: 'Trending TikTok Sound #1',
      hashtags: ['#fyp', '#viral', `#${params.concept.replace(/\s+/g, '')}`, '#streetwear']
    };

    this.eventBus.emit('social:tiktok_ready', postData);
    this.log('Contenido para TikTok generado exitosamente.');

    return postData;
  }
}
