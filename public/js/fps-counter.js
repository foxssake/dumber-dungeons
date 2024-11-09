export default class FPSCounter {
  #frametimes = []
  #count = 0
  #capacity = 0
  #sum = 0
  #head = 0

  constructor(capacity) {
    this.#capacity = capacity
    this.#frametimes = new Array(capacity)
    this.#frametimes.fill(0)
  }

  pushMillis(frametime) {
    frametime /= 1000. // Use seconds internally
    this.#sum += frametime - this.#frametimes[this.#head]

    this.#frametimes[this.#head] = frametime
    this.#count = Math.min(this.#count + 1, this.#capacity)
    this.#head = (this.#head + 1) % this.#capacity
  }

  isEmpty() {
    return this.#count <= 0
  }

  get averageFrameTime() {
    return this.isEmpty() ? 0 : this.#sum / this.#count
  }

  get averageFps() {
    return this.isEmpty() ? 0 : 1. / this.averageFrameTime
  }
}
