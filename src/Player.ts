import { GameObject } from './engine/GameObject'
import { PlayerAliveState } from './State'
import { BodyType, FLAP_AUDIO, FLAP_FORCE, ROTATION_ACCERATION } from './engine/constants'
import { PlayerState } from './types/state'
import UpdateInput from './types/update'

class Player extends GameObject {
    private _sprite: HTMLImageElement[]
    private _spriteSource: string[]
    private _spriteCycle: number[]
    private _frameCount: number
    private _currentFrame: number
    private _flapAudio: HTMLAudioElement
    private _rotationSpeed: number
    private _rotationAcceleration: number
    private _flapped = false
    private _start: number
    private _state: PlayerState
    public static player: Player

    constructor() {
        super(68, 48, BodyType.RIGID_BODY, 'Player')
        console.log('Player created')
        this._sprite = []
        this._spriteSource = [
            'assets/images/yellowbird-midflap.png',
            'assets/images/yellowbird-upflap.png',
            'assets/images/yellowbird-downflap.png',
        ]
        this._spriteSource.forEach((source) => {
            const sprite = document.createElement('img')
            sprite.src = source
            this._sprite.push(sprite)
        })
        this._spriteCycle = [0, 1, 0, 2]
        this._frameCount = 0
        this._currentFrame = 0
        this._flapAudio = document.createElement('audio')
        this._flapAudio.src = FLAP_AUDIO
        this._rotationSpeed = 0
        this._rotationAcceleration = 0
        this._start = Date.now()
        this._state = new PlayerAliveState()
        Player.player = this
    }

    public static getInstance(): Player {
        if (!Player.player) {
            Player.player = new Player()
            console.log('Player created')
        }
        return Player.player
    }

    update(updateInput: UpdateInput): void {
        super.update(updateInput)
        let rotation =
            this.transform.getRotation() + (this._rotationSpeed * updateInput.delta) / 1000
        if (rotation < -30) {
            rotation = -30
            this._rotationSpeed = 0
        } else if (rotation > 90) {
            rotation = 90
        } else {
            rotation =
                this.transform.getRotation() + (this._rotationSpeed * updateInput.delta) / 1000
            this._rotationSpeed += (this._rotationAcceleration * updateInput.delta) / 1000
        }
        this.transform.setRotation(rotation)
    }

    set spriteSource(value: string) {
        this.spriteSource = value
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (!this.display) return
        this._state.render(this, ctx)
    }

    flap(): void {
        if (this._flapped) return
        this._flapped = true
        this.setSpeed(-FLAP_FORCE)
        this.setRotation(-30)
        this.setRotationSpeed(0)
        this._flapAudio.currentTime = 0
        this._flapAudio.play().catch(function (error) {
            console.log('Audio play was prevented:', error)
        })
    }

    unflap(): void {
        this._flapped = false
    }

    public setRotationSpeed(value: number): void {
        this._rotationSpeed = value
    }

    public setRotationAcceleration(value: number): void {
        this._rotationAcceleration = value
    }

    public get start(): number {
        return this._start
    }

    public set start(value: number) {
        this._start = value
    }

    public get currentFrame(): number {
        return this._currentFrame
    }

    public set currentFrame(value: number) {
        this._currentFrame = value
    }

    public get spriteCycle(): number[] {
        return this._spriteCycle
    }

    public get sprite(): HTMLImageElement[] {
        return this._sprite
    }

    public set state(value: PlayerState) {
        this._state = value
    }
}

export default Player
