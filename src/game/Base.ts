import { GameObject } from '../engine/game-objects'
import { BodyType } from '../engine/constants'

class Base extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    constructor(width: number, height: number, bodyType: BodyType) {
        super(width, height, bodyType, 'Base')
        this.sprite = document.createElement('img')
        this.spriteSource = 'assets/images/base.png'
        this.sprite.src = this.spriteSource
        this.width = width
        this.height = height
    }
    render(ctx: CanvasRenderingContext2D) {
        if (!this.display) return
        const position = this.transform.getPosition()
        ctx.drawImage(this.sprite, position.x, position.y, this.width, this.height)
    }
}

export default Base
