class ScoreManager {
    private _score = 0
    private _highScore = 0

    get score() {
        return this._score
    }

    get highScore() {
        return this._highScore
    }

    public update() {
        if (this._score > this._highScore) {
            this._highScore = this._score
        }
    }

    public increaseScore() {
        this._score++
    }

    public resetScore() {
        this._score = 0
    }
}

export default ScoreManager
