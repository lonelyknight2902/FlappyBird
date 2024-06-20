import { CANVAS_HEIGHT, FLASH_IN_OUT_TIME } from '../../constants'
import { InputHandler } from '../../../engine/inputs'
import { ImageElement, TextElement, UIElement } from '../../../engine/user-interface'
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
    private _gameOverTitle: ImageElement
    private _finalScoreTitleText: TextElement
    private _highScoreTitleText: TextElement
    private _finalScoreText: TextElement
    private _highScoreText: TextElement
    private _newHighScore: TextElement
    handleInput(game: GameScene): GameState | null {
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        if (
            (inputHandler.isKeyDown('Space') || inputHandler.isTouchStart()) &&
            Date.now() - this._start > 3000
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
        this._finalScoreTitleText.render(ctx)
        this._finalScoreText.render(ctx)
        this._highScoreTitleText.render(ctx)
        this._highScoreText.render(ctx)
        if (this._highScoreText.textAnimation && !this._highScoreText.textAnimation.isPlaying) {
            this._newHighScore.render(ctx)
        }
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
        // this._gameOverTitle = new TextElement(
        //     game.canvas.canvas.width / 2,
        //     200,
        //     100,
        //     100,
        //     'Game Over',
        //     'Courier New',
        //     50,
        //     'bold',
        //     true
        // )
        this._gameOverTitle = new ImageElement(
            game.canvas.canvas.width / 2 - (192 * 3) / 4,
            -200,
            192 * 1.5,
            42 * 1.5,
            'assets/images/gameover.png'
        )
        this._gameOverTitle.animation = new TransformAnimation(
            new Transform(game.canvas.canvas.width / 2 - (192 * 3) / 4, -200, 0, 1),
            new Transform(game.canvas.canvas.width / 2 - (192 * 3) / 4, 200, 0, 1),
            this._gameOverTitle,
            300,
            (t: number) => Math.sin((t * Math.PI) / 2)
        )
        this._gameOverTitle.animation.play(FLASH_IN_OUT_TIME * 2)
        this._resultDashboard = new UIElement(game.canvas.canvas.width / 2 - 60, 800, 120, 220)
        this._resultDashboard.backgroundColor = 'rgb(219, 218, 150)'
        this._finalScoreTitleText = new TextElement(
            this._resultDashboard.width / 2,
            50,
            100,
            100,
            'SCORE',
            'Flappy Bird',
            25,
            '',
            true
        )
        // this._finalScoreTitleText.textAlign = 'right'
        this._finalScoreTitleText.color = '#E06119'
        this._finalScoreText = new TextElement(
            this._resultDashboard.width / 2,
            85,
            100,
            100,
            '0',
            'Flappy Bird',
            40,
            '',
            true
        )
        // this._finalScoreText.textAlign = 'right'
        this._highScoreTitleText = new TextElement(
            this._resultDashboard.width / 2,
            this._resultDashboard.height - 85,
            100,
            100,
            'BEST',
            'Flappy Bird',
            25,
            '',
            true
        )
        this._highScoreText = new TextElement(
            this._resultDashboard.width / 2,
            this._resultDashboard.height - 50,
            100,
            100,
            game.scoreManager.highScore.toString(),
            'Flappy Bird',
            40,
            '',
            true
        )
        // this._highScoreText.textAlign = 'right'
        // this._highScoreTitleText.textAlign = 'right'
        this._finalScoreText.textStroke = true
        this._highScoreText.textStroke = true
        this._highScoreTitleText.color = '#E06119'
        this._finalScoreTitleText.parent = this._resultDashboard
        this._highScoreTitleText.parent = this._resultDashboard
        this._finalScoreText.parent = this._resultDashboard
        this._highScoreText.parent = this._resultDashboard
        this._resultDashboard.addChild(this._finalScoreTitleText)
        this._resultDashboard.addChild(this._highScoreTitleText)
        this._resultDashboard.addChild(this._finalScoreText)
        this._resultDashboard.addChild(this._highScoreText)
        this._resultDashboard.animation = new TransformAnimation(
            new Transform(game.canvas.canvas.width / 2 - 60, CANVAS_HEIGHT, 0, 1),
            new Transform(game.canvas.canvas.width / 2 - 60, 300, 0, 1),
            this._resultDashboard,
            250,
            (t: number) => Math.sin((t * Math.PI) / 2)
        )
        this._finalScoreText.textAnimation = new TextAnimation(
            0,
            game.scoreManager.score,
            500,
            1000
        )
        this._newHighScore = new TextElement(
            this._resultDashboard.width / 2,
            this._resultDashboard.height - 20,
            30,
            20,
            'NEW',
            'Flappy Bird',
            10,
            '',
            true
        )
        this._resultDashboard.addChild(this._newHighScore)
        this._newHighScore.parent = this._resultDashboard
        this._newHighScore.backgroundColor = 'red'
        this._newHighScore.display = false
        if (game.scoreManager.score > game.scoreManager.highScore) {
            this._newHighScore.display = true
            console.log('New High Score')
            this._highScoreText.textAnimation = new TextAnimation(
                game.scoreManager.highScore,
                game.scoreManager.score,
                500,
                1000
            )
            this._highScoreText.textAnimation.play(FLASH_IN_OUT_TIME + 2000)
            game.scoreManager.update()
        }
        this._resultDashboard.animation.play(FLASH_IN_OUT_TIME + 1000)
        this._finalScoreText.textAnimation.play(FLASH_IN_OUT_TIME + 1400)
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
