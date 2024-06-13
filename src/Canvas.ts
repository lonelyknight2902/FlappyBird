import { BACKGROUND_DAY } from "./constants"

class Canvas {
    private _canvas: HTMLCanvasElement
    private _background: HTMLImageElement
    private _backgroundSource: string
    constructor(width: number, height: number) {
        this._canvas = document.createElement('canvas')
        this._canvas.width = width
        this._canvas.height = height
        this._canvas.style.height = '100vh'
        const game = document.getElementById('game')
        if (game === null) {
            alert('Unable to find game element')
            return
        }
        game.appendChild(this.canvas)
        this._background = document.createElement('img')
        this._backgroundSource = BACKGROUND_DAY
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value
    }

    public getContext(): CanvasRenderingContext2D | null {
        return this.canvas.getContext('2d')
    }

    renderBackground() {
        const ctx = this.canvas.getContext('2d')
        if (ctx === null) {
            alert('Unable to get 2d context')
            return
        }
        this._background.src = this._backgroundSource
        ctx.drawImage(this._background, 0, 0, this.canvas.width, this.canvas.height)
    }

    public set backgroundSource(value: string) {
        this._backgroundSource = value
    }

    public get backgroundSource(): string {
        return this._backgroundSource
    }

    public clear() {
        const ctx = this.canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

export default Canvas
