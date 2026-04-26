import { BaseAgent, DesignApprovedEvent } from '@mmnexus/core';

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

  public listen() {
    this.eventBus.on('design.approved', async (event: DesignApprovedEvent) => {
      if (!event.imageUrl || !event.copyVariants?.tiktok) {
        this.log('Payload inválido, ignorando evento (Falta imageUrl o copyVariant.tiktok)');
        return;
      }
      this.log(`Recibido design.approved. Iniciando TikTok...`);
      await this.execute({
        baseAssetUri: event.imageUrl,
        concept: event.niche,
        targetAudience: 'Comunidad TikTok'
      });
    });
  }

  public async execute(params: TikTokVideoParams): Promise<TikTokPost> {
    this.log(`Generando cover vertical y hook para TikTok. Concepto: ${params.concept}`);
    
    // 1. Llamada a la API para generar el asset nativo del canal
    let imageUrl = params.baseAssetUri; // Fallback a la imagen cruda
    try {
      const response = await fetch('http://localhost:3000/api/ai/channel-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'TIKTOK',
          concept: params.concept,
          productTitle: `Trending: ${params.concept}`,
          basePrompt: params.baseAssetUri,
          visualDirection: "Imagen súper llamativa en formato vertical 9:16. Colores vibrantes y composición enfocada en atrapar la atención (hook-first).",
          assetBrief: "Crear un cover impactante para un video corto, estilo viral de TikTok.",
          contentFormat: "VIDEO_COVER" // o IMAGE dependiendo de tu contrato
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.url) {
          imageUrl = json.data.url;
          this.log(`Asset cover de TikTok derivado exitosamente: ${imageUrl}`);
        }
      } else {
        this.log(`Error al derivar asset para TikTok (HTTP ${response.status}). Usando fallback.`);
      }
    } catch (error) {
      this.log(`Error en la red al llamar a channel-asset: ${error}. Usando fallback.`);
    }

    // 2. Generación del Copy / Guion
    const caption = `POV: Encontraste el diseño definitivo de ${params.concept}. 🔥\n\nLink en bio.`;
    
    const postData: TikTokPost = {
      format: '9:16',
      videoOrImageUri: imageUrl,
      caption,
      suggestedAudio: 'Trending TikTok Sound #1',
      hashtags: ['#fyp', '#viral', `#${params.concept.replace(/\s+/g, '')}`, '#streetwear']
    };

    // Emitir el evento de que el video/script de TikTok está listo
    this.eventBus.emit('social:tiktok_ready', postData);
    this.log('Cover de TikTok generado exitosamente con asset derivado.');

    return postData;
  }
}
