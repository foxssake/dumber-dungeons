import { vec2 } from './vec2';

export default class DummyWalker<T> {
  public moveSpeed = 32;
  public accelSpeed = 128;
  public target = new vec2(128, 128);
  public targetRange = 96;
  public position = new vec2();
  private velocity = new vec2();

  constructor(public sprite: T) {}

  public update(dt: number): void {
    // Calculate weights
    let cohesionWeight =
      this.position.distanceTo(this.target) / this.targetRange;
    cohesionWeight = Math.min(1, Math.max(0, cohesionWeight));
    cohesionWeight = Math.pow(cohesionWeight, 4);

    const brownianWeight = 1 - cohesionWeight;

    // Calculate forces
    const brownianForce = vec2.randomDirection().scale(brownianWeight);

    const cohesionForce = this.position
      .directionTo(this.target)
      .scale(cohesionWeight);

    const acceleration = new vec2()
      .add(cohesionForce)
      .add(brownianForce)
      .scale(this.accelSpeed * dt);

    this.velocity.add(acceleration);
    if (this.velocity.length() > this.moveSpeed)
      this.velocity.scaleTo(this.moveSpeed);

    this.position.add(this.velocity.clone().scale(dt));
  }
}
