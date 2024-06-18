import UpdateInput from "../../types/update"

class Animation {
    private _frames: HTMLImageElement[]
    private _currentFrame = 0
    private _frameDuration = 0
    private _frameTime = 0
    private _isPlaying: boolean
    private _isLooping: boolean
    constructor() {
        this._frames = []
        this._currentFrame = 0
        this._frameDuration = 0
        this._frameTime = 0
        this._isPlaying = false
        this._isLooping = false
    }
    get currentFrame() {
        return this._frames[this._currentFrame]
    }
    get isPlaying() {
        return this._isPlaying
    }
    get isLooping() {
        return this._isLooping
    }
    get frameDuration() {
        return this._frameDuration
    }
    set frameDuration(value) {
        this._frameDuration = value
    }
    addFrame(frame: HTMLImageElement) {
        this._frames.push(frame)
    }
    play(isLooping = false) {
        this._isPlaying = true
        this._isLooping = isLooping
    }
    stop() {
        this._isPlaying = false
    }
    update(updateInput: UpdateInput) {
        if (this._isPlaying) {
            this._frameTime += updateInput.delta
            if (this._frameTime >= this._frameDuration) {
                this._frameTime = 0
                this._currentFrame++
                if (this._currentFrame >= this._frames.length) {
                    if (this._isLooping) {
                        this._currentFrame = 0
                    } else {
                        this._isPlaying = false
                        this._currentFrame = this._frames.length - 1
                    }
                }
            }
        }
    }
    reset() {
        this._currentFrame = 0
        this._frameTime = 0
    }
    // clone() {
    //     const animation = new Animation()
    //     animation._frames = this._frames
    //     animation._frameDuration = this._frameDuration
    //     animation._isLooping = this._isLooping
    //     return animation
    // }
}

export default Animation
