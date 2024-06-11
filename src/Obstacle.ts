import { GameObject } from "./GameObject"
import { BodyType } from "./constants"

class Obstacle extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    constructor() {
        super(150, 100, BodyType.STATIC_BODY)
        console.log('Obstacle created')
        this.sprite = document.createElement('img')
        this.spriteSource = 'assets/images/pipe-green.png'
        this.sprite.src = this.spriteSource
    }

    render(ctx: CanvasRenderingContext2D): void {
        const position = this.transform.getPosition()
        ctx.drawImage(this.sprite, position.x, position.y, 104, 640)
    }
}

export default Obstacle