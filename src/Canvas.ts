class Canvas {
    private canvas: HTMLCanvasElement
    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        const game = document.getElementById('game')
        if (game === null) {
            alert('Unable to find game element')
            return
        }
        game.appendChild(this.canvas)
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas
    }
}

export default Canvas
