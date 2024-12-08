interface Identifiable<T> {
  id: T;
}

export class BaseDAO<T extends Identifiable<K>, K> {
  private data = new Map<K, T>();

  public async save(...items: Array<T>): Promise<void> {
    for (const item of items) {
      this.data.set(item.id, item);
    }
  }

  public async find(id: K): Promise<T | undefined> {
    return this.data.get(id);
  }

  public async has(id: K): Promise<boolean> {
    return this.data.has(id);
  }

  public async delete(id: K): Promise<boolean> {
    return this.data.delete(id);
  }

  public async list(): Promise<Array<T>> {
    return [...this.data.values()];
  }
}
