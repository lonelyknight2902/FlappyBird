import UpdateInput from '../../types/update'
import { TextAnimation } from '../animations'
import UIElement from './UIElement'

class TextElement extends UIElement {
    private _text: string
    private _size: number
    private _weight: string
    private _family: string
    private _isCentered = false
    private _textAlign: CanvasTextAlign = 'left'
    public textAnimation: TextAnimation | null = null
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        family: string,
        size: number,
        weight: string,
        isCentered = false
    ) {
        super(x, y, width, height)
        this._text = text
        this._size = size
        this._weight = weight
        this._family = family
        this._isCentered = isCentered
    }

    public set textAlign(align: CanvasTextAlign) {
        this._textAlign = align
    }

    public setText(text: string): void {
        this._text = text
    }

    public update(updateInput: UpdateInput): void {
        super.update(updateInput)
        if (this.textAnimation) {
            this.textAnimation.update(updateInput)
            this._text = this.textAnimation.current.toString()
            console.log(this.textAnimation.current.toString())
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.display) return
        const position = this.getWorldPosition()
        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor
            ctx.fillRect(position.x, position.y, this._width, this._height)
        }
        ctx.font = `${this._weight} ${this._size}px ${this._family}`
        ctx.fillStyle = this.color ? this.color : 'white'
        if (this._isCentered) {
            ctx.save()
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            ctx.fillText(this._text, position.x, position.y)
            ctx.restore()
        } else {
            ctx.textAlign = this._textAlign
            ctx.fillText(this._text, position.x, position.y)
        }
    }
}

export default TextElement
