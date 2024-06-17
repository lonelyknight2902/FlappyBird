import { GameObject } from './engine/GameObject'
import { BodyType } from './engine/constants'

class Obstacle extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    constructor(width: number, height: number, spriteSource: string, bodyType: BodyType) {
        super(width, height, bodyType, 'Obstacle')
        console.log('Obstacle created')
        this.sprite = document.createElement('img')
        this.spriteSource = spriteSource
        this.sprite.src = this.spriteSource
        const randomY = Math.floor(Math.random() * 300) + 100
        this.setPosition(170, randomY)
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.display) return
        const position = this.getWorldPosition()
        super.render(ctx)
        ctx.drawImage(this.sprite, position.x, position.y, 104, 640)
    }
}

export default Obstacle
