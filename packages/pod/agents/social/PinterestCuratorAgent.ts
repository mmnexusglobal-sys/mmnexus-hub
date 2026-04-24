import { BaseAgent } from '@mmnexus/core';

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
    this.eventBus.on('design.approved', async (event: any) => {
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
    this.log(`Creando pin SEO-optimizado para: ${params.concept}`);

    const postData: PinterestPin = {
      format: '2:3',
      imageUri: params.baseImageUri,
      title: `Ideas de diseño: ${params.concept}`,
      description: `Descubre este increíble diseño de ${params.concept}. Perfecto para regalar o para tu estilo diario. Haz clic para ver más detalles y conseguir el tuyo. #Aesthetic #Design`,
      destinationLink: params.productUrl,
      boardName: `${params.concept} Inspiration`
    };

    this.eventBus.emit('social:pinterest_ready', postData);
    this.log('Pin de Pinterest generado exitosamente.');

    return postData;
  }
}
