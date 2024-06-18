import UpdateInput from './types/update'
import Canvas from './game/Canvas'
import { InputHandler } from './engine/inputs'
import { Scene } from './engine/scenes'
import GameScene from './game/GameScene'
import { TextElement } from './engine/user-interface'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './game/constants'

export class Game {
    private lastTime: number
    private _scenes: Scene[]
    private _currentScene: Scene
    public inputHandler: InputHandler
    public canvas: Canvas
    public fps = 0
    public frameCount = 0
    public lastFpsUpdate: number
    public fpsCounter: TextElement
    constructor() {
        console.log('Game created')
        this.canvas = Canvas.getInstance(CANVAS_WIDTH, CANVAS_HEIGHT)
        this._currentScene = new GameScene(this.canvas)
        this._scenes = [this._currentScene]
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
        this.inputHandler = new InputHandler(this.canvas.canvas)
        this.lastFpsUpdate = window.performance.now()
        this.fpsCounter = new TextElement(10, 10, 'FPS: 0', 'Arial', 10, 'normal')
    }

    processInput(): void {
        this._currentScene.processInput()
    }

    update(updateInput: UpdateInput): void {
        this._currentScene.update(updateInput)
        this.frameCount++
        const delta = updateInput.time - this.lastFpsUpdate
        if (delta > 1000) {
            this.fps = (this.frameCount * 1000) / delta
            this.frameCount = 0
            this.lastFpsUpdate = updateInput.time
            this.fpsCounter.setText(`FPS: ${Math.round(this.fps)}`)
        }
    }

    render(): void {
        const ctx = this.canvas.getContext()
        if (!ctx) return
        this._currentScene.render(ctx)
        this.fpsCounter.render(ctx)
    }

    loop(): void {
        const time = window.performance.now()
        const delta = time - this.lastTime
        this.processInput()
        this.update({ time, delta })
        this.render()
        this.lastTime = time
        requestAnimationFrame(() => this.loop())
    }
}

new Game()
