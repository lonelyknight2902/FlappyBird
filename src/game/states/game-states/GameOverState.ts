import { FLASH_IN_OUT_TIME } from "../../constants"
import { InputHandler } from "../../../engine/inputs"
import { TextElement } from "../../../engine/user-interface"
import { GameState } from "../../../types/state"
import UpdateInput from "../../../types/update"
import GameScene from "../../GameScene"
import { PlayerDeadState } from "../player-states"
import GameHomeState from "./GameHomeState"

class GameOverState implements GameState {
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
        console.log(game.player.state)
        game.player.state = new PlayerDeadState()
        console.log(game.player.state)
        game.player.state.enter(game.player)
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

export default GameOverState