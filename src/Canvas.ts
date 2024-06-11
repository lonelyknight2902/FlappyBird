class Canvas {
    private _canvas: HTMLCanvasElement
    constructor(width: number, height: number) {
        this._canvas = document.createElement('canvas')
        this._canvas.width = width
        this._canvas.height = height
        const game = document.getElementById('game')
        if (game === null) {
            alert('Unable to find game element')
            return
        }
        game.appendChild(this.canvas)
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value
    }

    renderBackground() {
        const ctx = this.canvas.getContext('2d')
        if (ctx === null) {
            alert('Unable to get 2d context')
            return
        }
        const image = new Image()
        image.src = 'assets/images/background-day.png'
        ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
    }
}

export default Canvas
