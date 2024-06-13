import { GameObject } from './GameObject'
import { BodyType, FLAP_AUDIO, FLAP_FORCE, FLAP_RATE, ROTATION_ACCERATION } from './constants'
import UpdateInput from './types/update'

class Player extends GameObject {
    private _sprite: HTMLImageElement
    private _spriteSource: string[]
    private _spriteCycle: number[]
    private _frameCount: number
    private _currentFrame: number
    private _flapAudio: HTMLAudioElement
    private _width: number
    private _height: number
    private _rotationSpeed: number
    private _rotationAcceleration: number

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
        this._rotationSpeed = 0
        this._rotationAcceleration = ROTATION_ACCERATION
        this._width = 68
        this._height = 48
    }

    update(updateInput: UpdateInput): void {
        super.update(updateInput)
        let rotation = this.transform.getRotation() + this._rotationSpeed * updateInput.delta / 1000
        if (rotation < -30) {
            rotation = -30
            this._rotationSpeed = 0
        } else if (rotation > 90) {
            rotation = 90
        } else {
            rotation = this.transform.getRotation() + this._rotationSpeed * updateInput.delta / 1000
            this._rotationSpeed += this._rotationAcceleration * updateInput.delta / 1000
        }
        this.transform.setRotation(rotation)
    }

    set spriteSource(value: string) {
        this.spriteSource = value
    }

    render(ctx: CanvasRenderingContext2D): void {
        this._frameCount++
        if (this._frameCount > FLAP_RATE) {
            this._frameCount = 0
            this._currentFrame++
            if (this._currentFrame > 3) this._currentFrame = 0
        }
        this._sprite.src = this._spriteSource[this._spriteCycle[this._currentFrame]]
        const position = this.transform.getPosition()
        ctx.save()
        ctx.translate(position.x + this._width / 2, position.y + this._height / 2)
        const rotation = this.transform.getRotation() * (Math.PI / 180)
        ctx.rotate(rotation)
        ctx.translate(-position.x - this._width / 2, -position.y - this._height / 2)
        ctx.drawImage(this._sprite, position.x, position.y, 68, 48)
        ctx.restore()
    }

    flap(): void {
        this.setSpeed(-FLAP_FORCE)
        this.setRotation(-30)
        this.setRotationSpeed(0)
        console.log('Rotation Speed:', this._rotationSpeed)
        this._flapAudio.currentTime = 0
        this._flapAudio.play()
    }

    public setRotationSpeed(value: number): void {
        this._rotationSpeed = value
    }
}

export default Player
