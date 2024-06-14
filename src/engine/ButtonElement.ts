import InputHandler from './InputHandler'
import TextElement from './TextElement'
import UIElement from './UIElement'

class ButtonElement extends UIElement {
    private _text: TextElement
    private _width: number
    private _height: number
    private _onClick: () => void
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        family: string,
        size: number,
        weight: string,
        isCenteredText = false
    ) {
        super(x, y)
        if (isCenteredText) {
            this._text = new TextElement(
                x + width / 2,
                y + height / 2,
                text,
                family,
                size,
                weight,
                isCenteredText
            )
        }
        this._width = width
        this._height = height
    }

    public setText(text: string): void {
        this._text.setText(text)
    }

    public update(inputHandler: InputHandler): void {
        if (
            (inputHandler.isClicked() &&
                this.isHovered(inputHandler.mouse.x, inputHandler.mouse.y)) ||
            (inputHandler.isTouchStart() &&
                this.isHovered(inputHandler.touch.x, inputHandler.touch.y))
        ) {
            this._onClick()
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#E06119'
        ctx.fillRect(this.getPosition().x, this.getPosition().y, this._width, this._height)
        this._text.render(ctx)
    }

    public set onClick(callback: () => void) {
        this._onClick = callback
    }

    public get onClick(): () => void {
        return this._onClick
    }

    public isHovered(x: number, y: number): boolean {
        console.log('Position: ', this.getPosition())
        return (
            x >= this.getPosition().x &&
            x <= this.getPosition().x + this._width &&
            y >= this.getPosition().y &&
            y <= this.getPosition().y + this._height
        )
    }
}

export default ButtonElement
