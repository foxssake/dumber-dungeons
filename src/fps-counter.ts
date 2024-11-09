export type seconds = number;
export type milliseconds = number;

export default class FPSCounter {
  private frametimes: Array<number> = []
  private count: number = 0
  private capacity: number = 0
  private sum: number = 0
  private head: number = 0

  constructor(capacity: number) {
    this.capacity = capacity
    this.frametimes = new Array(capacity)
    this.frametimes.fill(0)
  }

  pushMillis(frametime: milliseconds) {
    frametime /= 1000. // Use seconds internally
    this.sum += frametime - this.frametimes[this.head]

    this.frametimes[this.head] = frametime
    this.count = Math.min(this.count + 1, this.capacity)
    this.head = (this.head + 1) % this.capacity
  }

  isEmpty(): boolean {
    return this.count <= 0
  }

  get averageFrameTime(): seconds {
    return this.isEmpty() ? 0 : this.sum / this.count
  }

  get averageFps(): number {
    return this.isEmpty() ? 0 : 1. / this.averageFrameTime
  }
}
