import { GameObject } from './GameObject'
import { BodyType } from './constants'

class Obstacle extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    private width: number
    private height: number
    constructor(width: number, height: number, spriteSource: string, bodyType: BodyType) {
        super(width, height, bodyType)
        this.width = width
        this.height = height
        console.log('Obstacle created')
        this.sprite = document.createElement('img')
        this.spriteSource = spriteSource
        this.sprite.src = this.spriteSource
        const randomY = Math.floor(Math.random() * 300) + 100
        this.setPosition(170, randomY)
    }

    render(ctx: CanvasRenderingContext2D): void {
        const position = this.transform.getPosition()
        ctx.drawImage(this.sprite, position.x, position.y, 104, 640)
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }
}

export default Obstacle
