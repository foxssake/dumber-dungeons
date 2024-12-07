export type EventHandler<T> = (event: T) => void;

export class EventEmitter<T> {
  private handlers: Array<EventHandler<T>> = [];

  public add(handler: EventHandler<T>): void {
    this.handlers.push(handler);
  }

  public emit(event: T): void {
    this.handlers.forEach(handler => handler(event));
  }
}
