interface Identifiable<T> {
  id: T;
}

export class BaseDAO<T extends Identifiable<K>, K> {
  private data = new Map<K, T>();

  public save(...items: Array<T>): Promise<void> {
    for (const item of items) {
      this.data.set(item.id, item);
    }

    return Promise.resolve();
  }

  public find(id: K): Promise<T | undefined> {
    return Promise.resolve(this.data.get(id));
  }

  public has(id: K): Promise<boolean> {
    return Promise.resolve(this.data.has(id));
  }

  public delete(id: K): Promise<boolean> {
    return Promise.resolve(this.data.delete(id));
  }

  public list(): Promise<Array<T>> {
    return Promise.resolve([...this.data.values()]);
  }
}
