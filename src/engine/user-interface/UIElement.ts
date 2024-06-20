import UpdateInput from '../../types/update'
import { TransformAnimation } from '../animations'
import { Transform } from '../components'
import { InputHandler } from '../inputs'
import { Vector2 } from '../utils'

class UIElement {
    private _transform: Transform
    private _name: string
    protected _display = true
    public animation: TransformAnimation
    private _parent: UIElement | null = null
    private _children: UIElement[] = []
    private _backgroundColor: string
    private _color = 'white'
    private _borderColor: string
    private _borderWidth: number
    protected _width: number
    protected _height: number

    constructor(x: number, y: number, width: number, height: number) {
        this._transform = new Transform(x, y, 0, 1)
        this._width = width
        this._height = height
        this._borderColor = 'black'
        this._borderWidth = 1
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

    public set parent(parent: UIElement | null) {
        this._parent = parent
    }

    public get parent(): UIElement | null {
        return this._parent
    }

    public set backgroundColor(color: string) {
        this._backgroundColor = color
    }

    public get backgroundColor(): string {
        return this._backgroundColor
    }

    public set color(color: string) {
        this._color = color
    }

    public get color(): string {
        return this._color
    }

    public get width(): number {
        return this._width
    }

    public get height(): number {
        return this._height
    }

    public addChild(child: UIElement): void {
        this._children.push(child)
        child.parent = this
    }

    public removeChild(child: UIElement): void {
        const index = this._children.indexOf(child)
        if (index > -1) {
            this._children.splice(index, 1)
            child.parent = null
        }
    }

    public setPosition(x: number, y: number): void {
        this._transform.setPosition(x, y)
    }

    public getPosition(): Vector2 {
        return this._transform.getPosition()
    }

    public getWorldPosition(): Vector2 {
        let position = this.getPosition()
        let parent = this._parent
        while (parent) {
            position = position.add(parent.getPosition())
            parent = parent.parent
        }
        return position
    }

    public update(updateInput: UpdateInput): void {
        if (this.animation) this.animation.update(updateInput)
        this._children.forEach((child) => child.update(updateInput))
    }

    public updateButton(inputHandler: InputHandler, updateInput: UpdateInput): void {
        this.update(updateInput)
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this._display) return
        const position = this.getWorldPosition()
        ctx.fillStyle = this._backgroundColor ? this._backgroundColor : 'red'
        ctx.fillRect(position.x, position.y, this._width, this._height)
        if (this._borderWidth > 0) {
            ctx.strokeStyle = this._borderColor
            ctx.lineWidth = this._borderWidth
            ctx.strokeRect(position.x, position.y, this._width, this._height)
        }
    }
}

export default UIElement
