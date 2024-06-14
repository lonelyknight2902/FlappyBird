import Transform from "./Transform"
import Vector2 from "./Vector2"

class UIElement {
  private _transform: Transform
  constructor(x: number, y: number) {
    this._transform = new Transform(x, y, 0, 1)
  }

  public setPosition(x: number, y: number): void {
    this._transform.setPosition(x, y)
  }

  public getPosition(): Vector2 {
    return this._transform.getPosition()
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const position = this._transform.getPosition()
    ctx.fillRect(position.x, position.y, 150, 100)
    ctx.fillStyle = 'red'
  }
}

export default UIElement