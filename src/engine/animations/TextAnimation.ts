import UpdateInput from '../../types/update'

class TextAnimation {
    private _start: number
    private _target: number
    private _current: number
    private _isPlaying = false
    private _time = 0
    private _duration = 0
    private _delay = 0
    constructor(start: number, target: number, duration: number, delay = 0) {
        this._start = start
        this._target = target
        this._duration = duration
        this._current = start
        this._delay = delay
    }

    get isPlaying() {
        return this._isPlaying
    }

    play(delay = 0) {
        this._isPlaying = true
        this._time = 0
        this._delay = delay
    }

    stop() {
        this._isPlaying = false
    }

    update(updateInput: UpdateInput) {
        if (this._isPlaying) {
            this._time += updateInput.delta
            if (this._time < this._delay) return
            if (this._time >= this._duration + this._delay) {
                this._time = this._duration
                this._isPlaying = false
                return
            }
            const t = (this._time - this._delay) / this._duration
            this._current = Math.round(this._start + (this._target - this._start) * t)
        }
    }

    get current() {
        return this._current
    }
}

export default TextAnimation
