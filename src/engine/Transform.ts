import Vector2 from "./Vector2"

class Transform {
  private position: Vector2
  private rotation: number
  private scale: number
  constructor(positionX: number, positionY: number, rotation: number, scale: number) {
      this.position = new Vector2(positionX, positionY)
      this.rotation = rotation
      this.scale = scale
  }

  public getPosition(): Vector2 {
      return this.position
  }

  public setPosition(x: number, y: number): void {
      this.position.x = x
      this.position.y = y
  }

    public getRotation(): number {
        return this.rotation
    }

    public setRotation(rotation: number): void {
        this.rotation = rotation
    }
}

export default Transform