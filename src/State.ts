import ButtonElement from './engine/ButtonElement'
import Player from './Player'
import TextElement from './engine/TextElement'
import { FADE_OUT_TIME, FLAP_RATE, FLASH_IN_OUT_TIME, TriggerState } from './engine/constants'
import { Game } from './game'
import { GameState, PlayerState } from './types/state'
import UpdateInput from './types/update'

export class GameHomeState implements GameState {
    private _start: number
    private _end: number
    private _overlayAlpha: number
    private _startButton: ButtonElement
    private _gameTitle: TextElement
    handleInput(game: Game): GameState | null {
        // if ((game.inputHandler.isKeyDown('Space')) && Date.now() > this._end) {
        //     return new GameStartState()
        // }
        return null
    }
    update(game: Game, updateInput: UpdateInput): void {
        game.bases.forEach((base) => {
            base.update(updateInput)
        })
        game.baseSpawner()
        console.log(game.inputHandler.mouse)
        console.log(
            this._startButton.isHovered(game.inputHandler.mouse.x, game.inputHandler.mouse.y)
        )
        this._startButton.update(game.inputHandler)
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
        this._startButton.render(ctx)
        this._gameTitle.render(ctx)
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
        game.canvas.reset()
        game.player.state = new PlayerAliveState()
        this._startButton = new ButtonElement(
            game.canvas.canvas.width / 2 - 85,
            500,
            170,
            50,
            'Start',
            'Courier New',
            20,
            'bold',
            true
        )
        const onClick = () => {
            game.state = new GameStartState()
            game.state.enter(game)
        }
        // onClick.bind(this)
        this._startButton.onClick = onClick
        this._gameTitle = new TextElement(
            game.canvas.canvas.width / 2,
            200,
            'Flappy Bird',
            'Courier New',
            50,
            'bold',
            true
        )
    }
    exit(game: Game): void {
        return
    }
}
export class GameStartState implements GameState {
    private _start: number
    private _end: number
    private _overlayAlpha: number
    private _getReadyTitle: TextElement
    handleInput(game: Game): GameState | null {
        if ((game.inputHandler.isKeyDown('Space') || game.inputHandler.isTouchStart()) && Date.now() > this._end) {
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
        this._getReadyTitle.render(ctx)
        // const alpha = Math.max(0, this._overlayAlpha - (Date.now() - this._start) / FADE_OUT_TIME)
        // ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        // ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    enter(game: Game): void {
        this._start = Date.now()
        this._end = this._start + FADE_OUT_TIME
        this._overlayAlpha = 1
        game.player.setRotation(0)
        game.player.setRotationSpeed(0)
        game.canvas.reset()
        game.player.state = new PlayerAliveState()
        this._getReadyTitle = new TextElement(
            game.canvas.canvas.width / 2,
            200,
            'Get Ready',
            'Courier New',
            50,
            'bold',
            true
        )
    }
    exit(game: Game): void {
        return
    }
}

export class GamePlayState implements GameState {
    private _scoreText: TextElement
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space') || game.inputHandler.isTouchStart()) {
            game.player.flap()
            return null
        }
        game.player.unflap()
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        game.canvas.update(updateInput)
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
                this._scoreText.setText(game.scoreManager.score.toString())
            }
        }

        if (
            game.player.getPosition().y <= 0 ||
            game.player.getPosition().y >= game.canvas.canvas.height
        ) {
            collision = true
        }

        if (collision) {
            game.hitAudio.currentTime = 0.06
            game.hitAudio.play()
            game.state = new GameOverState()
            game.state.enter(game)
        }
    }

    render(game: Game): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.obstacles.forEach((obstacle) => {
            obstacle[0].render(ctx)
            obstacle[1].render(ctx)
        })
        game.player.render(ctx)
        game.bases.forEach((base) => {
            base.render(ctx)
        })
        game.triggerAreas.forEach((trigger) => {
            trigger.render(ctx)
        })
        this._scoreText.render(ctx)
    }

    enter(game: Game): void {
        game.player.flap()
        this._scoreText = new TextElement(
            game.canvas.canvas.width / 2,
            200,
            game.scoreManager.score.toString(),
            'Courier New',
            40,
            'bold',
            true
        )
    }
    exit(game: Game): void {
        return
    }
}

export class GameOverState {
    private _start: number
    private _end: number
    private _gameOverTitle: TextElement
    private _finalScoreText: TextElement
    private _highScoreText: TextElement
    handleInput(game: Game): GameState | null {
        if ((game.inputHandler.isKeyDown('Space') || game.inputHandler.isTouchStart()) && Date.now() - this._start > 1000) {
            game.player.setPosition(75, 300)
            game.obstacleInit()
            game.scoreManager.resetScore()
            return new GameHomeState()
        }
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        game.player.update(updateInput)
        for (const base of game.bases) {
            if (game.player.collider.checkCollision(base.collider)) {
                // game.player.handleCollision(updateInput, base.collider)
                game.player.setSpeed(0)
            }
        }
    }

    render(game: Game): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.obstacles.forEach((obstacle) => {
            obstacle[0].render(ctx)
            obstacle[1].render(ctx)
        })
        game.player.render(ctx)
        game.bases.forEach((base) => {
            base.render(ctx)
        })
        this._gameOverTitle.render(ctx)
        this._finalScoreText.setText('Score: ' + game.scoreManager.score.toString())
        this._highScoreText.setText('High score: ' + game.scoreManager.highScore.toString())
        this._finalScoreText.render(ctx)
        this._highScoreText.render(ctx)
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
        console.log('Game over')
        this._start = Date.now()
        this._end = this._start + FLASH_IN_OUT_TIME
        game.player.state = new PlayerDieState()
        this._gameOverTitle = new TextElement(
            game.canvas.canvas.width / 2,
            200,
            'Game Over',
            'Courier New',
            50,
            'bold',
            true
        )
        this._finalScoreText = new TextElement(
            game.canvas.canvas.width / 2,
            300,
            'Final Score: ' + game.scoreManager.score.toString(),
            'Courier New',
            40,
            'bold',
            true
        )
        this._highScoreText = new TextElement(
            game.canvas.canvas.width / 2,
            350,
            'High Score: ' + game.scoreManager.highScore.toString(),
            'Courier New',
            20,
            'bold',
            true
        )
    }
    exit(game: Game): void {
        return
    }
}

export class PlayerAliveState implements PlayerState {
    render(player: Player, ctx: CanvasRenderingContext2D): void {
        const current = Date.now()
        if (current - player.start > FLAP_RATE) {
            player.start = current
            player.currentFrame++
            if (player.currentFrame > player.spriteCycle.length - 1) player.currentFrame = 0
        }
        const currentSprite = player.sprite[player.spriteCycle[player.currentFrame]]
        const position = player.getPosition()
        ctx.save()
        ctx.translate(position.x + player.width / 2, position.y + player.height / 2)
        const rotation = player.getTransform().getRotation() * (Math.PI / 180)
        ctx.rotate(rotation)
        ctx.translate(-position.x - player.width / 2, -position.y - player.height / 2)
        ctx.drawImage(currentSprite, position.x, position.y, 68, 48)
        ctx.restore()
    }
}

export class PlayerDieState implements PlayerState {
    render(player: Player, ctx: CanvasRenderingContext2D): void {
        const currentSprite = player.sprite[player.spriteCycle[player.currentFrame]]
        const position = player.getPosition()
        ctx.save()
        ctx.translate(position.x + player.width / 2, position.y + player.height / 2)
        const rotation = player.getTransform().getRotation() * (Math.PI / 180)
        ctx.rotate(rotation)
        ctx.translate(-position.x - player.width / 2, -position.y - player.height / 2)
        ctx.drawImage(currentSprite, position.x, position.y, 68, 48)
        ctx.restore()
    }
}
