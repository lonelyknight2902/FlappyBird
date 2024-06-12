import UIElement from './UIElement'

class TextElement extends UIElement {
    private _text: string
    private _size: number
    private _weight: string
    private _family: string
    private _isCentered = false
    constructor(
        x: number,
        y: number,
        text: string,
        family: string,
        size: number,
        weight: string,
        isCentered = false
    ) {
        super(x, y)
        this._text = text
        this._size = size
        this._weight = weight
        this._family = family
        this._isCentered = isCentered
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this._weight} ${this._size}px ${this._family}`
        ctx.fillStyle = 'white'
        if (this._isCentered) {
            ctx.save()
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            ctx.fillText(this._text, this.getPosition().x, this.getPosition().y)
            ctx.restore()
        } else {
            ctx.fillText(this._text, this.getPosition().x, this.getPosition().y)
        }
    }
}

export default TextElement
