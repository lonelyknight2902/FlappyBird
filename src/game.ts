import UpdateInput from './types/update'
import Canvas from './Canvas'
import InputHandler from './engine/InputHandler'
import Scene from './engine/Scene'
import GameScene from './GameScene'

export class Game {
    private lastTime: number
    private _scenes: Scene[]
    private _currentScene: Scene
    public inputHandler: InputHandler
    public canvas: Canvas
    constructor() {
        console.log('Game created')
        this.canvas = Canvas.getInstance(450, 800)
        this._currentScene = new GameScene(this.canvas)
        this._scenes = [this._currentScene]
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
        this.inputHandler = new InputHandler(this.canvas.canvas)
    }

    processInput(): void {
        this._currentScene.processInput()
    }

    update(updateInput: UpdateInput): void {
        this._currentScene.update(updateInput)
    }

    render(): void {
        const ctx = this.canvas.getContext()
        if (!ctx) return
        this._currentScene.render(ctx)
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
