class Canvas {
    private canvas: HTMLCanvasElement;
    constructor(width: number, height: number) {
        console.log('Canvas class');
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        document.getElementById('game')?.appendChild(this.canvas);
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}

export default Canvas
