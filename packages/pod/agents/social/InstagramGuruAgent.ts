import { BaseAgent } from '@mmnexus/core';

export interface InstagramPostParams {
  baseImageUri: string;
  concept: string;
  targetAudience: string;
}

export interface InstagramPost {
  format: '1:1' | '4:5' | '9:16';
  images: string[];
  caption: string;
  hashtags: string[];
}

export class InstagramGuruAgent extends BaseAgent {
  constructor() {
    super('InstagramGuru');
  }

  public listen() {
    this.eventBus.on('design.approved', async (event: any) => {
      this.log(`Recibido design.approved. Iniciando Instagram...`);
      await this.execute({
        baseImageUri: event.imageUrl,
        concept: event.niche,
        targetAudience: 'Comunidad de Instagram'
      });
    });
  }

  public async execute(params: InstagramPostParams): Promise<InstagramPost> {
    this.log(`Generando copy y hashtags para el concepto: ${params.concept}`);
    
    // Simulación de LLM (e.g., Gemini) para copy adaptado
    const caption = `Descubre nuestro nuevo diseño inspirado en ${params.concept}. 🚀\n\nPerfecto para ${params.targetAudience}.\n\n¡Consíguelo ahora en el link de nuestra bio! 🛍️✨`;
    
    const hashtags = [
      '#MMNexus',
      `#${params.concept.replace(/\s+/g, '')}`,
      '#PrintOnDemand',
      '#Streetwear',
      '#DesignInspo'
    ];

    const postData: InstagramPost = {
      format: '1:1',
      images: [params.baseImageUri],
      caption,
      hashtags
    };

    // Emitir el evento de que el post de IG está listo
    this.eventBus.emit('social:instagram_ready', postData);
    this.log('Post de Instagram generado exitosamente.');

    return postData;
  }
}
