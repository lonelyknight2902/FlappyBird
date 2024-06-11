import { GameObject } from './GameObject'
import { BodyType } from './constants'

class Base extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    private width: number
    private height: number
    constructor(width: number, height: number, bodyType: BodyType) {
        super(width, height, bodyType)
        console.log('Base created')
        this.sprite = document.createElement('img')
        this.spriteSource = 'assets/images/base.png'
        this.sprite.src = this.spriteSource
        this.width = width
        this.height = height
    }
    render(ctx: CanvasRenderingContext2D) {
        const position = this.transform.getPosition()
        ctx.drawImage(this.sprite, position.x, position.y, this.width, this.height)
    }
}

export default Base
