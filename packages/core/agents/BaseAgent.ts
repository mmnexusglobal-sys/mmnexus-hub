import { globalEventBus, EventBus } from './EventBus';

export abstract class BaseAgent {
  protected eventBus: EventBus;
  public agentName: string;

  constructor(name: string) {
    this.agentName = name;
    this.eventBus = globalEventBus;
  }

  public abstract execute(context?: any): Promise<any>;

  protected log(message: string) {
    console.log(`[${this.agentName}] ${message}`);
  }
}
