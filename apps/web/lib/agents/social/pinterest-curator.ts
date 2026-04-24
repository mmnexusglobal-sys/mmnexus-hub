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

export class PinterestCurator {
  /**
   * Generates elongated pins (2:3), SEO-rich descriptions, and CTA for Pinterest.
   */
  public async createPin(params: PinterestPinParams): Promise<PinterestPin> {
    return {
      format: '2:3',
      imageUri: params.baseImageUri, // Should ideally be a 2:3 cropped/formatted image
      title: `Ideas de diseño: ${params.concept}`,
      description: `Descubre este increíble diseño de ${params.concept}. Perfecto para regalar o para tu estilo diario. Haz clic para ver más detalles y conseguir el tuyo. #Aesthetic #Design`,
      destinationLink: params.productUrl,
      boardName: `${params.concept} Inspiration`
    };
  }
}
