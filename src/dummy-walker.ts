const EPSILON = 0.000_001

class vec2 {
  public x: number = 0
  public y: number = 0

  constructor(x?: number, y?: number) {
    this.x = x ?? 0
    this.y = y ?? 0
  }

  distanceTo(p: vec2): number {
    return this.subtracted(p).length()
  }

  dot(p: vec2): number {
    return this.x * p.x + this.y * p.y
  }

  length(): number {
    return Math.sqrt(this.dot(this))
  }

  added(p: vec2): vec2 {
    return new vec2(
      this.x + p.x,
      this.y + p .y
    )
  }

  subtracted(p: vec2): vec2 {
    return new vec2(
      this.x - p.x,
      this.y - p.y
    )
  }

  scaled(f: number): vec2 {
    return new vec2(
      this.x * f,
      this.y * f
    )
  }

  scaledTo(l: number): vec2 {
    return this.normalized().scaled(l)
  }

  normalized(): vec2 {
    return this.length() > EPSILON
      ? this.scaled(1. / this.length())
      : this;
  }

  static randomDirection(): vec2 {
    return new vec2(
      2 * Math.random() - 1,
      2 * Math.random() - 1
    ).normalized()
  }
}

export default class DummyWalker<T> {
  public moveSpeed: number = 32
  public accelSpeed: number = 128
  public sprite: T | undefined

  public target: vec2 = new vec2(128, 128)

  public position: vec2 = new vec2()
  private velocity: vec2 = new vec2()

  constructor(sprite?: T) {
    this.sprite = sprite
  }

  update(dt: number): void {
    // Calculate weights
    let cohesionWeight = this.position.distanceTo(this.target) / 96
    cohesionWeight = Math.min(1., Math.max(0., cohesionWeight))
    cohesionWeight = Math.pow(cohesionWeight, 4.)

    const brownianWeight = 1 - cohesionWeight

    // Calculate forces
    const brownianForce = vec2.randomDirection().scaled(brownianWeight)

    const cohesionForce = this.target.subtracted(this.position)
      .normalized()
      .scaled(cohesionWeight)

    const acceleration = new vec2()
      .added(cohesionForce)
      .added(brownianForce)
      .normalized()
      .scaled(this.accelSpeed * dt)

    this.velocity = this.velocity.added(acceleration)
    if (this.velocity.length() > this.moveSpeed)
      this.velocity = this.velocity.scaledTo(this.moveSpeed)

    this.position = this.position.added(this.velocity.scaled(dt))
  }

  withSprite(cb: (sprite: T) => void) {
    this.sprite && cb(this.sprite)
  }
}
