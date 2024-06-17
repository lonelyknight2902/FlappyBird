import Transform from "./Transform"
import Vector2 from "./Vector2"

class UIElement {
  private _transform: Transform
  private _name: string
  protected _display = true
  constructor(x: number, y: number) {
    this._transform = new Transform(x, y, 0, 1)
  }

  public set name(name: string) {
    this._name = name
  }

  public get name(): string {
    return this._name
  }

  public set display(value: boolean) {
    this._display = value
  }

  public get display(): boolean {
    return this._display
  }

  public setPosition(x: number, y: number): void {
    this._transform.setPosition(x, y)
  }

  public getPosition(): Vector2 {
    return this._transform.getPosition()
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this._display) return
    const position = this._transform.getPosition()
    ctx.fillRect(position.x, position.y, 150, 100)
    ctx.fillStyle = 'red'
  }
}

export default UIElement