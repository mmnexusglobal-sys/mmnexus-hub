import { BaseAgent } from '@mmnexus/core';

export interface FacebookPostParams {
  baseImageUri: string;
  concept: string;
  communityContext: string;
}

export interface FacebookPost {
  format: '1.91:1' | '1:1';
  imageUri: string;
  text: string;
}

export class FacebookWingmanAgent extends BaseAgent {
  constructor() {
    super('FacebookWingman');
  }

  public async execute(params: FacebookPostParams): Promise<FacebookPost> {
    this.log(`Creando post comunitario para fans de: ${params.communityContext}`);

    const text = `¡Hola comunidad! 👋\n\nAcabamos de lanzar este nuevo diseño centrado en ${params.concept}. Creemos que a los fans de ${params.communityContext} les encantará.\n\n¿Qué opinan? Déjennos sus comentarios abajo. 👇✨`;
    
    const postData: FacebookPost = {
      format: '1.91:1',
      imageUri: params.baseImageUri,
      text
    };

    this.eventBus.emit('social:facebook_ready', postData);
    this.log('Post de Facebook generado exitosamente.');

    return postData;
  }
}
