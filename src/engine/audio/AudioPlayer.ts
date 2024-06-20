class AudioPlayer {
    private _audio: HTMLAudioElement

    public constructor(audio: HTMLAudioElement) {
        this._audio = audio
        this._audio.preload = 'auto'
    }

    public play(): void {
        this._audio.pause()
        this._audio.currentTime = 0
        this._audio.play().catch(function (error) {
            console.log('Audio play was prevented:', error)
        })
    }

    public stop(): void {
        this._audio.pause()
    }
}

export default AudioPlayer
