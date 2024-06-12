import { GameObject } from './GameObject'
import { BodyType, FLAP_AUDIO, FLAP_FORCE } from './constants'

class Player extends GameObject {
    private _sprite: HTMLImageElement
    private _spriteSource: string[]
    private _spriteCycle: number[]
    private _frameCount: number
    private _currentFrame: number
    private _flapAudio: HTMLAudioElement
    constructor() {
        super(68, 48, BodyType.RIGID_BODY)
        console.log('Player created')
        this._sprite = document.createElement('img')
        this._spriteSource = [
            'assets/images/yellowbird-midflap.png',
            'assets/images/yellowbird-upflap.png',
            'assets/images/yellowbird-downflap.png',
        ]
        this._spriteCycle = [0, 1, 0, 2]
        this._frameCount = 0
        this._currentFrame = 0
        this._sprite.src = this._spriteSource[this._spriteCycle[this._currentFrame]]
        this._flapAudio = document.createElement('audio')
        this._flapAudio.src = FLAP_AUDIO
    }

    set spriteSource(value: string) {
        this.spriteSource = value
    }

    render(ctx: CanvasRenderingContext2D): void {
        this._frameCount++
        if (this._frameCount > 15) {
            this._frameCount = 0
            this._currentFrame++
            if (this._currentFrame > 3) this._currentFrame = 0
        }
        this._sprite.src = this._spriteSource[this._spriteCycle[this._currentFrame]]
        const position = this.transform.getPosition()
        ctx.drawImage(this._sprite, position.x, position.y, 68, 48)
    }

    flap(): void {
        console.log('Flap')
        this.setSpeed(-FLAP_FORCE)
        this._flapAudio.play()
    }
}

export default Player
