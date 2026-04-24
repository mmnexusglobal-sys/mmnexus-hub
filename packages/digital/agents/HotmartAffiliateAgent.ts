import { BaseAgent } from '@mmnexus/core';

export class HotmartAffiliateAgent extends BaseAgent {
  constructor() {
    super('HotmartAffiliateAgent');
  }

  public async execute(context?: any): Promise<any> {
    this.log('Iniciando gestión de embudo Hotmart...');
    throw new Error('Not implemented: Integración con Hotmart pendiente.');
  }
}
