import { BaseAgent, DesignApprovedEvent } from '@mmnexus/core';

export interface PinterestPinParams {
  baseImageUri: string;
  concept: string;
  productUrl: string;
}

export interface PinterestPin {
  format: '2:3';
  imageUri: string;
  title: string;
  description: string;
  destinationLink: string;
  boardName: string;
}

export class PinterestCuratorAgent extends BaseAgent {
  constructor() {
    super('PinterestCurator');
  }

  public listen() {
    this.eventBus.on('design.approved', async (event: DesignApprovedEvent) => {
      if (!event.imageUrl || !event.copyVariants?.pinterest) {
        this.log('Payload inválido, ignorando evento (Falta imageUrl o copyVariant.pinterest)');
        return;
      }
      this.log(`Recibido design.approved. Iniciando Pinterest...`);
      await this.execute({
        baseImageUri: event.imageUrl,
        concept: event.niche,
        productUrl: 'https://mmnexus.com/pending' // Placeholder for now
      });
    });
  }

  public async execute(params: PinterestPinParams): Promise<PinterestPin> {
    this.log(`Generando pin para Pinterest (Vertical). Concepto: ${params.concept}`);
    
    // 1. Llamada a la API para generar el asset nativo del canal
    let imageUrl = params.baseImageUri; // Fallback a la imagen cruda
    try {
      const response = await fetch('http://localhost:3000/api/ai/channel-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'PINTEREST',
          concept: params.concept,
          productTitle: `Idea de ${params.concept}`,
          basePrompt: params.baseImageUri,
          visualDirection: "Fotografía vertical aesthetic, ideal para un tablero de inspiración. Composición limpia con espacio para texto.",
          assetBrief: "Crear una imagen 2:3 o 9:16 altamente pineable, enfocada en descubrimiento visual y estética flatlay o lifestyle.",
          contentFormat: "IMAGE"
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.url) {
          imageUrl = json.data.url;
          this.log(`Asset de Pinterest derivado exitosamente: ${imageUrl}`);
        }
      } else {
        this.log(`Error al derivar asset para Pinterest (HTTP ${response.status}). Usando fallback.`);
      }
    } catch (error) {
      this.log(`Error en la red al llamar a channel-asset: ${error}. Usando fallback.`);
    }

    // 2. Generación del Copy y Keywords
    const title = `Inspiración: ${params.concept}`;
    const description = `Idea increíble de diseño inspirado en ${params.concept}. Explora esta y más ideas en nuestro catálogo. ${params.concept} Inspiration #${params.concept.replace(/\s+/g, '')}`;
    
    const pinData: PinterestPin = {
      format: '2:3',
      imageUri: imageUrl,
      title,
      description,
      destinationLink: 'https://mmnexus.global',
      boardName: `${params.concept} Inspiration`
    };

    // Emitir el evento de que el post de Pinterest está listo
    this.eventBus.emit('social:pinterest_ready', pinData);
    this.log('Pin de Pinterest generado exitosamente con asset derivado.');

    return pinData;
  }
}
