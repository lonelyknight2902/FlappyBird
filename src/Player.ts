import { GameObject } from './GameObject'
import Vector2 from './Vector2'
import { BodyType, FLAP_FORCE } from './constants'

class Player extends GameObject {
    private _sprite: HTMLImageElement
    private _spriteSource: string
    constructor() {
        super(68, 48, BodyType.RIGID_BODY)
        console.log('Player created')
        this._sprite = document.createElement('img')
        this._spriteSource = 'assets/images/bluebird-upflap.png'
        this._sprite.src = this._spriteSource
    }

    set spriteSource(value: string) {
        this.spriteSource = value
    }

    render(ctx: CanvasRenderingContext2D): void {
        const position = this.transform.getPosition()
        ctx.drawImage(this._sprite, position.x, position.y, 68, 48)
    }

    flap(): void {
        console.log('Flap')
        this.setSpeed(-FLAP_FORCE)
    }
}

export default Player
