import { BACKGROUND_DAY, BACKGROUND_NIGHT, DAY_NIGHT_CYCLE_TIME } from './engine/constants'
import UpdateInput from './types/update'

class Canvas {
    private _canvas: HTMLCanvasElement
    private _background: { [key: string]: HTMLImageElement }
    private _currentBackground: string
    private _start: number
    private _currentAlpha: number
    private _restart: boolean
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
        const backgroundDay = document.createElement('img')
        backgroundDay.src = BACKGROUND_DAY
        const backgroundNight = document.createElement('img')
        backgroundNight.src = BACKGROUND_NIGHT
        this._background = {
            day: backgroundDay,
            night: backgroundNight,
        }
        this._currentBackground = 'day'
        this._restart = true
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

    public update(updateInput: UpdateInput): void {
        let time: number
        if (this._restart) {
            this._start = Date.now()
            time = 0
            this._restart = false
        } else {
            time = (Date.now() - this._start) / DAY_NIGHT_CYCLE_TIME
        }
        if (time >= 1) {
            this._start = Date.now()
            this._currentBackground = this._currentBackground === 'day' ? 'night' : 'day'
            time = 0
        }
        this._currentAlpha = (time * time) / (2.0 * (time * time - time) + 1.0)
    }

    public reset(): void {
        this._start = Date.now()
        this._currentBackground = 'day'
        this._currentAlpha = 0
        this._restart = true
    }

    renderBackground() {
        const ctx = this.canvas.getContext('2d')
        if (ctx === null) {
            alert('Unable to get 2d context')
            return
        }
        ctx.save()
        ctx.globalAlpha = this._currentAlpha
        ctx.drawImage(
            this._background[this._currentBackground === 'day' ? 'night' : 'day'],
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
        ctx.globalAlpha = 1 - this._currentAlpha
        ctx.drawImage(
            this._background[this._currentBackground],
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )

        ctx.restore()
    }

    public set currentBackground(key: string) {
        this._currentBackground = key
    }

    public get currentBackground(): string {
        return this._currentBackground
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
