import {
    BACKGROUND_DAY,
    BACKGROUND_NIGHT,
    FADE_OUT_TIME,
    FLASH_IN_OUT_TIME,
    TriggerState,
} from './constants'
import { Game } from './game'
import { GameState } from './types/state'
import UpdateInput from './types/update'

export class GameStartState implements GameState {
    private _start: number
    private _end: number
    private _overlayAlpha: number
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space') && Date.now() > this._end) {
            return new GamePlayState()
        }
        return null
    }
    update(game: Game, updateInput: UpdateInput): void {
        game.bases.forEach((base) => {
            base.update(updateInput)
        })
        game.baseSpawner()
    }

    render(game: Game): void {
        const canvas = game.canvas.canvas
        const ctx = game.canvas.getContext()
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.player.render(ctx)
        game.bases.forEach((base) => {
            base.render(ctx)
        })
        game.gameTitle.render(ctx)
        const alpha = Math.max(0, this._overlayAlpha - (Date.now() - this._start) / FADE_OUT_TIME)
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    enter(game: Game): void {
        this._start = Date.now()
        this._end = this._start + FADE_OUT_TIME
        this._overlayAlpha = 1
        game.player.setRotation(0)
        game.player.setRotationSpeed(0)
    }
    exit(game: Game): void {
        return
    }
}

export class GamePlayState implements GameState {
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space')) {
            game.player.flap()
            return null
        }
        game.player.unflap()
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        game.player.update(updateInput)
        game.bases.forEach((base) => {
            base.update(updateInput)
        })
        game.obstacles.forEach((obstacle) => {
            obstacle[0].update(updateInput)
            obstacle[1].update(updateInput)
        })
        game.triggerAreas.forEach((trigger) => {
            trigger.update(updateInput)
        })
        game.baseSpawner()
        game.obstacleSpawner()
        let collision = false
        for (const obstacle of game.obstacles) {
            if (
                game.player.collider.checkCollision(obstacle[0].collider) ||
                game.player.collider.checkCollision(obstacle[1].collider)
            ) {
                console.log('Collision detected')
                // game.player.handleCollision(updateInput, obstacle[0].collider)
                collision = true
                break
            }
        }

        for (const base of game.bases) {
            if (game.player.collider.checkCollision(base.collider)) {
                console.log('Collision detected')
                // game.player.handleCollision(updateInput, base.collider)
                collision = true
                game.player.setSpeed(0)
                game.state = new GameOverState()
                game.state.enter(game)
            }
        }
        for (const trigger of game.triggerAreas) {
            // trigger.update(updateInput)
            if (trigger.triggerUpdate([game.player]) === TriggerState.EXIT) {
                game.scoreManager.increaseScore()
                game.scoreManager.update()
                if (game.scoreManager.score % 10 === 0 && game.scoreManager.score !== 0) {
                    if (game.canvas.backgroundSource === BACKGROUND_DAY) {
                        game.canvas.backgroundSource = BACKGROUND_NIGHT
                    } else {
                        game.canvas.backgroundSource = BACKGROUND_DAY
                    }
                }
                game.scoreText.setText(game.scoreManager.score.toString())
            }
        }

        if (collision) {
            game.hitAudio.currentTime = 0.06
            game.hitAudio.play()
            game.state = new GameOverState()
            game.state.enter(game)
        }

        game.player.updateGravity(updateInput)
    }

    render(game: Game): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.player.render(ctx)
        game.obstacles.forEach((obstacle) => {
            obstacle[0].render(ctx)
            obstacle[1].render(ctx)
        })
        game.bases.forEach((base) => {
            base.render(ctx)
        })
        game.triggerAreas.forEach((trigger) => {
            trigger.render(ctx)
        })
        game.scoreText.render(ctx)
    }

    enter(game: Game): void {
        return
    }
    exit(game: Game): void {
        return
    }
}

export class GameOverState {
    private _start: number
    private _end: number
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space') && Date.now() - this._start > 1000) {
            game.player.setPosition(75, 300)
            game.obstacleInit()
            game.scoreManager.resetScore()
            game.scoreText.setText('0')
            return new GameStartState()
        }
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        console.log('Game over')
    }

    render(game: Game): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.player.render(ctx)
        game.obstacles.forEach((obstacle) => {
            obstacle[0].render(ctx)
            obstacle[1].render(ctx)
        })
        game.bases.forEach((base) => {
            base.render(ctx)
        })
        game.gameOverTitle.render(ctx)
        game.finalScoreText.setText('Score: ' + game.scoreManager.score.toString())
        game.highScoreText.setText('High score: ' + game.scoreManager.highScore.toString())
        game.finalScoreText.render(ctx)
        game.highScoreText.render(ctx)
        let alpha: number
        if (Date.now() - this._start <= FLASH_IN_OUT_TIME / 2) {
            alpha = Math.min(1, (Date.now() - this._start) / FLASH_IN_OUT_TIME / 2)
        } else {
            alpha = Math.max(0, 1 - (Date.now() - this._start) / FLASH_IN_OUT_TIME / 2)
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    enter(game: Game): void {
        this._start = Date.now()
        this._end = this._start + FLASH_IN_OUT_TIME
    }
    exit(game: Game): void {
        return
    }
}
