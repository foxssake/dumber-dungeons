interface Identifiable<T> {
  id: T
}

export class BaseDAO<T extends Identifiable<K>, K> {
  private data = new Map<K, T>();

  public save(...items: Array<T>): void {
    for(const item of items) {
      this.data.set(item.id, item);
    }
  }

  public find(id: K): T | undefined {
    return this.data.get(id);
  }

  public has(id: K): boolean {
    return this.data.has(id);
  }

  public delete(id: K): boolean {
    return this.data.delete(id);
  }

  public list(): Array<T> {
    return [...this.data.values()]
  }
}
