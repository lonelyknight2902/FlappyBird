import Vector2 from "../utils/Vector2"

class Velocity {
  private speed: number
  private direction: Vector2
  constructor(speed = 0, direction = Vector2.zero) {
      this.speed = speed
      this.direction = direction
  }

  public getSpeed(): number {
      return this.speed
  }

  public getDirection(): Vector2 {
      return this.direction
  }

  public setSpeed(speed: number): void {
      this.speed = speed
  }

  public setDirection(direction: Vector2): void {
      this.direction = direction
  }
}

export default Velocity