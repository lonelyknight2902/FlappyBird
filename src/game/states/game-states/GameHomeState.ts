import { BASE_SPEED, FADE_OUT_TIME } from "../../constants"
import { InputHandler } from "../../../engine/inputs"
import { ButtonElement, TextElement } from "../../../engine/user-interface"
import { GameState } from "../../../types/state"
import UpdateInput from "../../../types/update"
import Canvas from "../../Canvas"
import GameScene from "../../GameScene"
import { PlayerAliveState } from "../player-states"
import GameStartState from "./GameStartState"

class GameHomeState implements GameState {
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
        this._startButton.updateButton(inputHandler, updateInput)
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
        console.log('GameHomeState')
        this._start = Date.now()
        this._end = this._start + FADE_OUT_TIME
        this._overlayAlpha = 1
        game.player.setRotation(0)
        game.player.setRotationSpeed(0)
        game.player.setRotationAcceleration(0)
        game.player.animation.play(true)
        game.bases.children.forEach((base) => {
            base.setSpeed(BASE_SPEED)
        })
        const canvas = Canvas.getInstance(450, 800)
        canvas.reset()
        game.player.state = new PlayerAliveState()
        game.resetObstacle()
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
            100,
            100,
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

export default GameHomeState
