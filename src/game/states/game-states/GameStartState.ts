import { FADE_OUT_TIME } from '../../constants'
import { InputHandler } from '../../../engine/inputs'
import { ImageElement, TextElement } from '../../../engine/user-interface'
import { GameState } from '../../../types/state'
import UpdateInput from '../../../types/update'
import Canvas from '../../Canvas'
import GameScene from '../../GameScene'
import { GamePlayState } from '../game-states'
import { PlayerAliveState } from '../player-states'

class GameStartState implements GameState {
    private _start: number
    private _end: number
    private _overlayAlpha: number
    private _getReadyTitle: TextElement
    private _getReadyImage: ImageElement
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
        // this._getReadyTitle.render(ctx)
        this._getReadyImage.render(ctx)
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
            100,
            100,
            'Get Ready',
            'Courier New',
            50,
            'bold',
            true
        )
        this._getReadyImage = new ImageElement(
            game.canvas.canvas.width / 2 - (184 * 3) / 4,
            50,
            184 * 1.5,
            267 * 1.5,
            'assets/images/message.png'
        )
    }
    exit(game: GameScene): void {
        return
    }
}

export default GameStartState
