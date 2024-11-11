export type seconds = number;
export type milliseconds = number;

export default class FPSCounter {
  private frametimes: Array<number> = [];
  private count: number = 0;
  private capacity: number = 0;
  private sum: number = 0;
  private head: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    // TODO: talk about https://typescript-eslint.io/rules/no-unsafe-assignment/
    this.frametimes = new Array<number>(capacity);
    this.frametimes.fill(0);
  }

  public get averageFrameTime(): seconds {
    return this.isEmpty() ? 0 : this.sum / this.count;
  }

  public get averageFps(): number {
    return this.isEmpty() ? 0 : 1 / this.averageFrameTime;
  }

  public pushMillis(frameTime: milliseconds): void {
    const frameTimeInSeconds = frameTime / 1000; // Use seconds internally
    this.sum += frameTimeInSeconds - this.frametimes[this.head];

    this.frametimes[this.head] = frameTimeInSeconds;
    this.count = Math.min(this.count + 1, this.capacity);
    this.head = (this.head + 1) % this.capacity;
  }

  public isEmpty(): boolean {
    return this.count <= 0;
  }
}
