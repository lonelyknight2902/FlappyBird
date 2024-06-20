import UIElement from './UIElement'

class ImageElement extends UIElement {
    private _image: HTMLImageElement
    constructor(x: number, y: number, width: number, height: number, imageSrc: string) {
        super(x, y, width, height)
        this._image = new Image()
        this._image.src = imageSrc
    }

    public setImage(image: HTMLImageElement): void {
        this._image = image
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.display) return
        const position = this.getWorldPosition()
        ctx.drawImage(this._image, position.x, position.y, this._width, this._height)
    }
}

export default ImageElement
