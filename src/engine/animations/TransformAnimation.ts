import UpdateInput from '../../types/update'
import { Transform } from '../components'
import { GameObject } from '../game-objects'
import { UIElement } from '../user-interface'

class TransformAnimation {
    private _start: Transform
    private _target: Transform
    private _gameObject: GameObject | UIElement
    private _duration: number
    private _transformFunction: (t: number) => number
    private _isPlaying: boolean
    private _time: number
    constructor(
        start: Transform,
        target: Transform,
        gameObject: GameObject | UIElement,
        duration: number,
        transformFunction: (t: number) => number
    ) {
        this._start = start
        this._target = target
        this._gameObject = gameObject
        this._duration = duration
        this._transformFunction = transformFunction
    }

    get isPlaying() {
        return this._isPlaying
    }

    play() {
        this._isPlaying = true
        this._time = 0
    }

    stop() {
        this._isPlaying = false
    }

    update(updateInput: UpdateInput) {
        if (this._isPlaying) {
            this._time += updateInput.delta
            if (this._time >= this._duration) {
                this._time = this._duration
                this._isPlaying = false
            }
            const t = this._transformFunction(this._time / this._duration)
            const start = this._start.getPosition()
            const target = this._target.getPosition()
            const x = start.x + (target.x - start.x) * t
            const y = start.y + (target.y - start.y) * t
            this._gameObject.setPosition(x, y)
        }
    }
}

export default TransformAnimation
