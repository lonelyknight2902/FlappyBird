import ButtonElement from './engine/ButtonElement'
import Player from './Player'
import TextElement from './engine/TextElement'
import { BASE_SPEED, FADE_OUT_TIME, FLAP_RATE, FLASH_IN_OUT_TIME, ROTATION_ACCERATION, TriggerState } from './engine/constants'
import { GameState, PlayerState } from './types/state'
import UpdateInput from './types/update'
import GameScene from './GameScene'
import TriggerObject from './engine/TriggerObject'
import InputHandler from './engine/InputHandler'
import Canvas from './Canvas'

export class GameHomeState implements GameState {
    private _start: number
    private _end: number
    private _overlayAlpha: number
    private _startButton: ButtonElement
    private _gameTitle: TextElement
    handleInput(game: GameScene): GameState | null {
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        if (inputHandler.isKeyDown('Space') && Date.now() > this._end) {
            return new GameStartState()
        }
        return null
    }
    update(game: GameScene, updateInput: UpdateInput): void {
        // game.bases.children.forEach((base) => {
        //     base.update(updateInput)
        // })
        game.gameObjects.forEach((obj) => {
            obj.update(updateInput)
        })
        game.baseSpawner()
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        this._startButton.update(inputHandler)
    }

    render(game: GameScene): void {
        const canvas = Canvas.getInstance(450, 800)
        const ctx = canvas.getContext()
        if (ctx === null) {
            return
        }
        canvas.clear()
        canvas.renderBackground()
        game.player.render(ctx)
        game.bases.children.forEach((base) => {
            base.render(ctx)
        })
        this._startButton.render(ctx)
        this._gameTitle.render(ctx)
        const alpha = Math.max(0, this._overlayAlpha - (Date.now() - this._start) / FADE_OUT_TIME)
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height)
    }

    enter(game: GameScene): void {
        this._start = Date.now()
        this._end = this._start + FADE_OUT_TIME
        this._overlayAlpha = 1
        game.player.setRotation(0)
        game.player.setRotationSpeed(0)
        game.player.setRotationAcceleration(0)
        game.bases.children.forEach((base) => {
            base.setSpeed(BASE_SPEED)
        })
        const canvas = Canvas.getInstance(450, 800)
        canvas.reset()
        game.player.state = new PlayerAliveState()
        this._startButton = new ButtonElement(
            canvas.canvas.width / 2 - 85,
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
            canvas.canvas.width / 2,
            200,
            'Flappy Bird',
            'Courier New',
            50,
            'bold',
            true
        )
    }
    exit(game: GameScene): void {
        return
    }
}
export class GameStartState implements GameState {
    private _start: number
    private _end: number
    private _overlayAlpha: number
    private _getReadyTitle: TextElement
    handleInput(game: GameScene): GameState | null {
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        if (
            (inputHandler.isKeyDown('Space') || inputHandler.isTouchStart()) &&
            Date.now() > this._end
        ) {
            return new GamePlayState()
        }
        return null
    }
    update(game: GameScene, updateInput: UpdateInput): void {
        game.gameObjects.forEach((obj) => {
            obj.update(updateInput)
        })
        game.baseSpawner()
    }

    render(game: GameScene): void {
        const canvas = Canvas.getInstance(450, 800)
        const ctx = canvas.getContext()
        if (ctx === null) {
            return
        }
        canvas.clear()
        canvas.renderBackground()
        game.player.render(ctx)
        game.bases.children.forEach((base) => {
            base.render(ctx)
        })
        this._getReadyTitle.render(ctx)
        // const alpha = Math.max(0, this._overlayAlpha - (Date.now() - this._start) / FADE_OUT_TIME)
        // ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        // ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    enter(game: GameScene): void {
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
    exit(game: GameScene): void {
        return
    }
}

export class GamePlayState implements GameState {
    private _scoreText: TextElement
    handleInput(game: GameScene): GameState | null {
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        if (inputHandler.isKeyDown('Space') || inputHandler.isTouchStart()) {
            game.player.flap()
            return null
        }
        game.player.unflap()
        return null
    }

    update(game: GameScene, updateInput: UpdateInput): void {
        game.canvas.update(updateInput)
        game.gameObjects.forEach((obj) => {
            obj.update(updateInput)
            obj.updateGravity(updateInput)
        })
        game.baseSpawner()
        game.obstacleSpawner()
        let collision = false
        for (const obstacle of game.obstacles.children) {
            if (
                game.player.collider.checkCollision(obstacle.children[0].collider) ||
                game.player.collider.checkCollision(obstacle.children[1].collider)
            ) {
                console.log('Obstacle Collision detected')
                console.log(game.player.collider)
                console.log(obstacle.children[0].collider)
                // game.player.handleCollision(updateInput, obstacle[0].collider)
                collision = true
                break
            }

            if (
                obstacle.children
                    .filter((obj) => obj instanceof TriggerObject)[0]
                    .triggerUpdate([game.player]) === TriggerState.EXIT
            ) {
                game.scoreManager.increaseScore()
                game.scoreManager.update()
                this._scoreText.setText(game.scoreManager.score.toString())
            }
        }

        for (const base of game.bases.children) {
            if (game.player.collider.checkCollision(base.collider)) {
                console.log('Base Collision detected')
                // game.player.handleCollision(updateInput, base.collider))
                collision = true
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

    render(game: GameScene): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.obstacles.children.forEach((obstacle) => {
            obstacle.render(ctx)
        })
        game.player.render(ctx)
        game.bases.children.forEach((base) => {
            base.render(ctx)
        })
        this._scoreText.render(ctx)
    }

    enter(game: GameScene): void {
        game.player.flap()
        game.player.setRotationAcceleration(ROTATION_ACCERATION)
        game.initObstacle()
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
    exit(game: GameScene): void {
        return
    }
}

export class GameOverState implements GameState {
    private _start: number
    private _end: number
    private _gameOverTitle: TextElement
    private _finalScoreText: TextElement
    private _highScoreText: TextElement
    handleInput(game: GameScene): GameState | null {
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        if (
            (inputHandler.isKeyDown('Space') || inputHandler.isTouchStart()) &&
            Date.now() - this._start > 1000
        ) {
            game.player.setPosition(75, 300)
            game.initObstacle()
            game.scoreManager.resetScore()
            return new GameHomeState()
        }
        return null
    }

    update(game: GameScene, updateInput: UpdateInput): void {
        game.gameObjects.forEach((obj) => {
            obj.update(updateInput)
            obj.updateGravity(updateInput)
        })
        for (const base of game.bases.children) {
            if (game.player.collider.checkCollision(base.collider)) {
                // game.player.handleCollision(updateInput, base.collider)
                game.player.setSpeed(0)
            }
        }
    }

    render(game: GameScene): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.obstacles.children.forEach((obstacle) => {
            obstacle.render(ctx)
        })
        game.player.render(ctx)
        game.bases.children.forEach((base) => {
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

    enter(game: GameScene): void {
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
        game.bases.children.forEach((base) => {
            base.setSpeed(0)
        })
        game.obstacles.children.forEach((obstacle) => {
            obstacle.setSpeed(0)
        })
    }
    exit(game: GameScene): void {
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
