import { FLASH_IN_OUT_TIME } from '../../constants'
import { InputHandler } from '../../../engine/inputs'
import { TextElement, UIElement } from '../../../engine/user-interface'
import { GameState } from '../../../types/state'
import UpdateInput from '../../../types/update'
import GameScene from '../../GameScene'
import { PlayerDeadState } from '../player-states'
import GameHomeState from './GameHomeState'
import { TextAnimation, TransformAnimation } from '../../../engine/animations'
import { Transform } from '../../../engine/components'

class GameOverState implements GameState {
    private _start: number
    private _end: number
    private _resultDashboard: UIElement
    private _gameOverTitle: TextElement
    private _finalScoreTitleText: TextElement
    private _highScoreTitleText: TextElement
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
        this._gameOverTitle.update(updateInput)
        this._resultDashboard.update(updateInput)
        this._finalScoreText.update(updateInput)
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
        this._resultDashboard.render(ctx)
        this._gameOverTitle.render(ctx)
        this._highScoreText.setText(game.scoreManager.highScore.toString())
        this._finalScoreTitleText.render(ctx)
        this._finalScoreText.render(ctx)
        this._highScoreTitleText.render(ctx)
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
        console.log(game.player.state)
        game.player.state = new PlayerDeadState()
        console.log(game.player.state)
        game.player.state.enter(game.player)
        this._gameOverTitle = new TextElement(
            game.canvas.canvas.width / 2,
            200,
            100,
            100,
            'Game Over',
            'Courier New',
            50,
            'bold',
            true
        )
        this._gameOverTitle.animation = new TransformAnimation(
            new Transform(game.canvas.canvas.width / 2, 0, 0, 1),
            new Transform(game.canvas.canvas.width / 2, 200, 0, 1),
            this._gameOverTitle,
            200,
            (t: number) => Math.sin((t * Math.PI) / 2)
        )
        this._gameOverTitle.animation.play()
        this._resultDashboard = new UIElement(game.canvas.canvas.width / 2 - 200, 800, 400, 200)
        this._resultDashboard.backgroundColor = 'rgb(219, 218, 150)'
        this._finalScoreTitleText = new TextElement(
            this._resultDashboard.width - 20,
            50,
            100,
            100,
            'SCORE',
            'Courier New',
            30,
            'bold',
            false
        )
        this._finalScoreTitleText.textAlign = 'right'
        this._finalScoreTitleText.color = 'rgb(210,170,79)'
        this._finalScoreText = new TextElement(
            this._resultDashboard.width - 20,
            80,
            100,
            100,
            '0',
            'Courier New',
            30,
            'bold',
            false
        )
        this._finalScoreText.textAlign = 'right'
        this._highScoreTitleText = new TextElement(
            this._resultDashboard.width - 20,
            this._resultDashboard.height - 80,
            100,
            100,
            'BEST',
            'Courier New',
            30,
            'bold',
            false
        )
        this._highScoreText = new TextElement(
            this._resultDashboard.width - 20,
            this._resultDashboard.height - 50,
            100,
            100,
            game.scoreManager.highScore.toString(),
            'Courier New',
            30,
            'bold',
            false
        )
        this._highScoreText.textAlign = 'right'
        this._highScoreTitleText.textAlign = 'right'
        this._highScoreTitleText.color = 'rgb(210,170,79)'
        this._finalScoreTitleText.parent = this._resultDashboard
        this._highScoreTitleText.parent = this._resultDashboard
        this._finalScoreText.parent = this._resultDashboard
        this._highScoreText.parent = this._resultDashboard
        this._resultDashboard.addChild(this._finalScoreTitleText)
        this._resultDashboard.addChild(this._highScoreTitleText)
        this._resultDashboard.addChild(this._finalScoreText)
        this._resultDashboard.addChild(this._highScoreText)
        this._resultDashboard.animation = new TransformAnimation(
            new Transform(game.canvas.canvas.width / 2 - 200, 800, 0, 1),
            new Transform(game.canvas.canvas.width / 2 - 200, 300, 0, 1),
            this._resultDashboard,
            500,
            (t: number) => Math.sin((t * Math.PI) / 2)
        )
        this._finalScoreText.textAnimation = new TextAnimation(0, game.scoreManager.score, 500, 1000)
        this._resultDashboard.animation.play()
        this._finalScoreText.textAnimation.play()
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

export default GameOverState
