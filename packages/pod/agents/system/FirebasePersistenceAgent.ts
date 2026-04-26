import { BaseAgent, DesignApprovedEvent } from '@mmnexus/core';

export class FirebasePersistenceAgent extends BaseAgent {
  constructor() {
    super('FirebasePersistence');
  }

  public listen() {
    // 1. Escuchar cuando un diseño se aprueba y se convierte en el esqueleto de una campaña
    this.eventBus.on('design.approved', async (event: DesignApprovedEvent) => {
      this.log(`Guardando inicio de campaña para diseño: ${event.designId || 'unknown'}`);
      
      const designId = event.designId || `design_${Date.now()}`;
      // Inyectamos el ID si no venía para que el resto de los eventos puedan usarlo
      (event as any).designId = designId;

      await fetch('http://localhost:3000/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_design',
          payload: {
            designId,
            niche: event.niche,
            imageUrl: event.imageUrl,
            copyVariants: event.copyVariants,
          }
        })
      });
    });

    // 2. Escuchar respuestas de agentes sociales para adjuntar sus assets a la campaña
    this.eventBus.on('social:instagram_ready', async (postData: any) => {
      this.saveSocialAsset('instagram', postData);
    });

    this.eventBus.on('social:pinterest_ready', async (pinData: any) => {
      this.saveSocialAsset('pinterest', pinData);
    });

    this.eventBus.on('social:tiktok_ready', async (videoData: any) => {
      this.saveSocialAsset('tiktok', videoData);
    });
  }

  private async saveSocialAsset(channel: string, data: any) {
    this.log(`Guardando asset de ${channel} en Firestore...`);
    
    // Asumimos que el orchestrator pasa el designId en memoria, de lo contrario usamos uno fallback
    const designId = data.designId || `design_${Date.now()}`; // Recomendación: propagar designId en los social params

    await fetch('http://localhost:3000/api/db/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_social_asset',
        payload: {
          designId,
          channel,
          data
        }
      })
    });
  }

  public async execute(): Promise<any> {
    // Este agente es pasivo (reacciona a eventos), no tiene ejecución imperativa
    return {};
  }
}
