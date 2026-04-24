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

export class FacebookWingman {
  /**
   * Crafts conversational posts suitable for Facebook pages and groups.
   */
  public async createPost(params: FacebookPostParams): Promise<FacebookPost> {
    const text = `¡Hola comunidad! 👋\n\nAcabamos de lanzar este nuevo diseño centrado en ${params.concept}. Creemos que a los fans de ${params.communityContext} les encantará.\n\n¿Qué opinan? Déjennos sus comentarios abajo. 👇✨`;
    
    return {
      format: '1.91:1', // Standard Facebook link/image format
      imageUri: params.baseImageUri,
      text
    };
  }
}
