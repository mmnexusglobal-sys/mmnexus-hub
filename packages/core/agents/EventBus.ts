export interface DesignApprovedEvent {
  eventType: 'design.approved';
  designId: string;
  imageUrl: string;
  copyVariants: Record<'instagram' | 'tiktok' | 'pinterest' | 'facebook', string>;
  niche: string;
  timestamp: string;
}

export class EventBus {
  private listeners: Record<string, Function[]> = {};

  public on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public emit(event: string, payload?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }
}

export const globalEventBus = new EventBus();
