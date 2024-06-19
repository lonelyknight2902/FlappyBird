import GameObject from './GameObject'
import { Transform } from '../components'
import { BodyType, TriggerState } from '../constants'
import { POINT_AUDIO } from '../../game/constants'

class TriggerObject extends GameObject {
    private _transform: Transform
    private _width: number
    private _height: number
    private _objectsInArea: GameObject[]
    private _audio: HTMLAudioElement

    constructor(width: number, height: number, x: number, y: number) {
        super(width, height, BodyType.STATIC_BODY)
        console.log('TriggerObject constructor')
        this._transform = new Transform(x, y, 0, 1)
        this._width = width
        this._height = height
        this._objectsInArea = []
        this.setPosition(x, y)
        // this._audio = document.createElement('audio')
        // this._audio.src = POINT_AUDIO
    }

    public set audio(audio: HTMLAudioElement) {
        this._audio = audio
    }

    public triggerUpdate(objects: GameObject[]): TriggerState {
        // if (this._objectsInArea.length > 0) {
        //     console.log('hihihihih')
        //     console.log('TriggerObject objectsInArea:', this._objectsInArea)
        // }
        for (let i = 0; i < objects.length; i++) {
            if (
                this.collider.checkCollision(objects[i].collider) &&
                !this._objectsInArea.includes(objects[i])
            ) {
                this.onTriggerEnter(objects[i])
                return TriggerState.ENTER
            } else if (
                !this.collider.checkCollision(objects[i].collider) &&
                this._objectsInArea.includes(objects[i])
            ) {
                this.onTriggerExit(objects[i])
                return TriggerState.EXIT
            }
        }
        return TriggerState.STAY
    }

    public onTriggerEnter(object: GameObject) {
        console.log('TriggerObject onTriggerEnter')
        this._objectsInArea.push(object)
    }
    public onTriggerExit(object: GameObject) {
        console.log('TriggerObject onTriggerExit')
        this._objectsInArea = this._objectsInArea.filter((obj) => obj !== object)
        this._audio?.play()
    }
    public onTriggerStay() {
        console.log('TriggerObject onTriggerStay')
    }

    public reset() {
        this._objectsInArea = []
    }

    public render(ctx: CanvasRenderingContext2D): void {
        return
    }
}

export default TriggerObject
