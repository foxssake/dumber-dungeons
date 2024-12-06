export class EventSource {
  private listeners: Map<string, Array<Function>> = new Map();

  public on(event: string, handler: Function): void {
    if(!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)?.push(handler);
  }

  public emit(event: string, ...data: Array<any>): void {
    this.listeners.get(event)?.forEach(
      listener => listener(...data)
    );
  }
}
