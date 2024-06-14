class InputHandler {
    private _keys: { [key: string]: boolean } = {}
    private _mouse: { x: number; y: number } = { x: 0, y: 0 }
    private _touch: { x: number; y: number } = { x: 0, y: 0 }
    private _mouseClick = false
    private _canvas: HTMLCanvasElement
    private _touchStart = false

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        window.addEventListener('keydown', (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                this._keys['Space'] = true
            } else {
                this._keys[e.key] = true
            }
        })

        window.addEventListener('touchstart', (e) => {
            e.preventDefault()
            this._touchStart = true
            const bound = this._canvas.getBoundingClientRect()
            const scaleX = this._canvas.width / bound.width
            const scaleY = this._canvas.height / bound.height
            this._touch.x = (e.touches[0].clientX - bound.left) * scaleX
            this._touch.y = (e.touches[0].clientY - bound.top) * scaleY
        })

        window.addEventListener('touchend', (e) => {
            e.preventDefault()
            this._touchStart = false
        })

        window.addEventListener('keyup', (e) => {
            e.preventDefault()
            if (e.key === ' ') {
                this._keys['Space'] = false
            } else {
                this._keys[e.key] = false
            }
        })

        window.addEventListener('mousemove', (e) => {
            const bound = this._canvas.getBoundingClientRect()
            const scaleX = this._canvas.width / bound.width
            const scaleY = this._canvas.height / bound.height
            this._mouse.x = (e.clientX - bound.left) * scaleX
            this._mouse.y = (e.clientY - bound.top) * scaleY
        })

        window.addEventListener('click', (e) => {
            e.preventDefault()
            this._mouseClick = true
        })
    }

    public isKeyDown(key: string): boolean {
        return this._keys[key] || false
    }

    public get mouse(): { x: number; y: number } {
        return this._mouse
    }

    public isClicked(): boolean {
        return this._mouseClick
    }

    public get touch(): { x: number; y: number } {
        return this._touch
    }

    public isTouchStart(): boolean {
        return this._touchStart
    }
}

export default InputHandler
