import { BaseAgent } from './BaseAgent';

export class AgentOrchestrator {
  private pipeline: BaseAgent[] = [];

  public addStep(agent: BaseAgent) {
    this.pipeline.push(agent);
  }

  public async run(initialContext: any): Promise<any> {
    let context = initialContext;
    console.log(`🚀 Iniciando Orquestación (${this.pipeline.length} pasos)`);

    for (const agent of this.pipeline) {
      try {
        console.log(`⏳ Ejecutando paso: ${agent.agentName}`);
        context = await agent.execute(context);
      } catch (error) {
        console.error(`❌ Error en el paso ${agent.agentName}:`, error);
        throw error;
      }
    }

    console.log(`✅ Orquestación completada exitosamente`);
    return context;
  }
}
