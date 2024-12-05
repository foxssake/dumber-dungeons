const EPSILON = 0.000_001;

export class vec2 {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public static randomDirection(): vec2 {
    return new vec2(2 * Math.random() - 1, 2 * Math.random() - 1).normalize();
  }

  public clone(): vec2 {
    return new vec2(this.x, this.y);
  }

  public distanceTo(p: vec2): number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }

  public directionTo(p: vec2): vec2 {
    return this.vectorTo(p).normalize();
  }

  public vectorTo(p: vec2): vec2 {
    return new vec2(p.x - this.x, p.y - this.y);
  }

  public dot(p: vec2): number {
    return this.x * p.x + this.y * p.y;
  }

  public length(): number {
    return Math.sqrt(this.dot(this));
  }

  public add(p: vec2): this {
    this.x += p.x;
    this.y += p.y;

    return this;
  }

  public subtract(p: vec2): this {
    this.x -= p.x;
    this.y -= p.y;

    return this;
  }

  public scale(f: number): this {
    this.x *= f;
    this.y *= f;

    return this;
  }

  public scaleTo(d: number): this {
    const l = this.length();
    if (l > EPSILON) {
      this.x *= d / l;
      this.y *= d / l;
    }

    return this;
  }

  public normalize(): this {
    const l = this.length();
    if (l > EPSILON) {
      this.x /= l;
      this.y /= l;
    }

    return this;
  }
}
