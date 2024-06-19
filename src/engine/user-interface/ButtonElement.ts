import UpdateInput from '../../types/update'
import { InputHandler } from '../inputs'
import TextElement from './TextElement'
import UIElement from './UIElement'

class ButtonElement extends UIElement {
    private _text: TextElement
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
        super(x, y, width, height)
        this._text = new TextElement(
            x + width / 2,
            y + height / 2,
            width,
            height,
            text,
            family,
            size,
            weight,
            isCenteredText
        )
    }

    public setText(text: string): void {
        this._text.setText(text)
    }

    public updateButton(inputHandler: InputHandler, updateInput: UpdateInput): void {
        super.updateButton(inputHandler, updateInput)
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
        if (!this.display) return
        const position = this.getWorldPosition()
        ctx.fillStyle = '#E06119'
        ctx.fillRect(position.x, position.y, this._width, this._height)
        this._text.render(ctx)
    }

    public set onClick(callback: () => void) {
        this._onClick = callback
    }

    public get onClick(): () => void {
        return this._onClick
    }

    public isHovered(x: number, y: number): boolean {
        return (
            x >= this.getPosition().x &&
            x <= this.getPosition().x + this._width &&
            y >= this.getPosition().y &&
            y <= this.getPosition().y + this._height
        )
    }
}

export default ButtonElement
