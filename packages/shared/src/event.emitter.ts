export type EventHandler<T> = (event: T) => void;

export class EventEmitter<T> {
  private handlers: Array<EventHandler<T>> = [];

  public add(handler: EventHandler<T>): void {
    this.handlers.push(handler);
  }

  public emit(event: T): void {
    this.handlers.forEach((handler) => {
      handler(event);
    });
  }

  public remove(handler: EventHandler<T>): boolean {
    const handlerIdx = this.handlers.indexOf(handler);
    if (handlerIdx < 0)
      return false;

    this.handlers.splice(handlerIdx, 1);
    return true;
  }
}
