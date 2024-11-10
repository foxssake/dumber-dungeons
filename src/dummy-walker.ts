const EPSILON = 0.000_001

class vec2 {
  public x: number = 0
  public y: number = 0

  constructor(x?: number, y?: number) {
    this.x = x ?? 0
    this.y = y ?? 0
  }

  clone(): vec2 {
    return new vec2(this.x, this.y)
  }

  distanceTo(p: vec2): number {
    return Math.sqrt(
      Math.pow(this.x - p.x, 2) +
      Math.pow(this.y - p.y, 2)
    )
  }

  directionTo(p: vec2): vec2 {
    return this.vectorTo(p).normalize()
  }

  vectorTo(p: vec2): vec2 {
    return new vec2(
      p.x - this.x,
      p.y - this.y
    )
  }

  dot(p: vec2): number {
    return this.x * p.x + this.y * p.y
  }

  length(): number {
    return Math.sqrt(this.dot(this))
  }

  add(p: vec2): vec2 {
    this.x += p.x
    this.y += p.y

    return this
  }

  subtract(p: vec2): vec2 {
    this.x -= p.x
    this.y -= p .y

    return this
  }

  scale(f: number): vec2 {
    this.x *= f
    this.y *= f

    return this
  }

  scaleTo(d: number): vec2 {
    const l = this.length()
    if (l > EPSILON) {
      this.x *= d / l
      this.y *= d / l
    }

    return this
  }

  normalize(): vec2 {
    const l = this.length()
    if (l > EPSILON) {
      this.x /= l
      this.y /= l
    }

    return this
  }

  static randomDirection(): vec2 {
    return new vec2(
      2 * Math.random() - 1,
      2 * Math.random() - 1
    ).normalize()
  }
}

export default class DummyWalker<T> {
  constructor(
    public sprite: T,

    public moveSpeed = 32,
    public accelSpeed = 128,

    public target = new vec2(128, 128),

    public position = new vec2(),
    private velocity = new vec2()
  ) {}

  update(dt: number): void {
    // Calculate weights
    let cohesionWeight = this.position.distanceTo(this.target) / 96
    cohesionWeight = Math.min(1., Math.max(0., cohesionWeight))
    cohesionWeight = Math.pow(cohesionWeight, 4.)

    const brownianWeight = 1 - cohesionWeight

    // Calculate forces
    const brownianForce = vec2.randomDirection().scale(brownianWeight)

    const cohesionForce = this.position.directionTo(this.target)
      .scale(cohesionWeight)

    const acceleration = new vec2()
      .add(cohesionForce)
      .add(brownianForce)
      .scale(this.accelSpeed * dt)

    this.velocity.add(acceleration)
    if (this.velocity.length() > this.moveSpeed)
      this.velocity.scaleTo(this.moveSpeed)

    this.position.add(this.velocity.clone().scale(dt))
  }
}
