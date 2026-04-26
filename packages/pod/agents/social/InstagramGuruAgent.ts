import { BaseAgent, DesignApprovedEvent } from '@mmnexus/core';

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
    this.eventBus.on('design.approved', async (event: DesignApprovedEvent) => {
      if (!event.imageUrl || !event.copyVariants?.instagram) {
        this.log('Payload inválido, ignorando evento (Falta imageUrl o copyVariant.instagram)');
        return;
      }
      this.log(`Recibido design.approved. Iniciando Instagram...`);
      await this.execute({
        baseImageUri: event.imageUrl,
        concept: event.niche,
        targetAudience: 'Comunidad de Instagram'
      });
    });
  }

  public async execute(params: InstagramPostParams): Promise<InstagramPost> {
    this.log(`Generando mockup Lifestyle 1:1 para Instagram. Concepto: ${params.concept}`);
    
    // 1. Llamada a la API para generar el asset nativo del canal
    let imageUrl = params.baseImageUri; // Fallback a la imagen cruda
    try {
      const response = await fetch('http://localhost:3000/api/ai/channel-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'INSTAGRAM',
          concept: params.concept,
          productTitle: `Diseño de ${params.concept}`,
          basePrompt: params.baseImageUri,
          visualDirection: "Fotografía lifestyle premium. Un modelo usando la prenda en un entorno urbano aesthetic.",
          assetBrief: "Crear una imagen 1:1 instagrameable, enfocada en moda y lifestyle.",
          contentFormat: "IMAGE"
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.url) {
          imageUrl = json.data.url;
          this.log(`Asset de Instagram derivado exitosamente: ${imageUrl}`);
        }
      } else {
        this.log(`Error al derivar asset para Instagram (HTTP ${response.status}). Usando fallback.`);
      }
    } catch (error) {
      this.log(`Error en la red al llamar a channel-asset: ${error}. Usando fallback.`);
    }

    // 2. Generación del Copy y Hashtags (esto podría ir luego a tu LLM)
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
      images: [imageUrl],
      caption,
      hashtags
    };

    // Emitir el evento de que el post de IG está listo
    this.eventBus.emit('social:instagram_ready', postData);
    this.log('Post de Instagram generado exitosamente con asset derivado.');

    return postData;
  }
}
