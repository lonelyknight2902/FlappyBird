import Player from './Player'
import UpdateInput from './types/update'
import Canvas from './Canvas'
import Vector2 from './Vector2'
import InputHandler from './InputHandler'

export class Game {
    public player: Player
    private lastTime: number
    private canvas: Canvas
    private inputHandler: InputHandler
    constructor() {
        console.log('Game created')
        this.player = new Player()
        this.player.setSpeed(50)
        this.canvas = new Canvas(800, 600)
        this.inputHandler = new InputHandler()
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
    }

    processInput(): void {
        let xDirection = 0
        let yDirection = 0
        if (this.inputHandler.isKeyDown('ArrowUp')) {
            yDirection = -1
        } else if (this.inputHandler.isKeyDown('ArrowDown')) {
            yDirection = 1
        }
        if (this.inputHandler.isKeyDown('ArrowLeft')) {
            xDirection = -1
        } else if (this.inputHandler.isKeyDown('ArrowRight')) {
            xDirection = 1
        }
        this.player.setDirection(new Vector2(xDirection, yDirection))
        // this.player.setVelocity(5, new Vector2(xDirection, yDirection))
    }

    update(updateInput: UpdateInput): void {
        // console.log('Updating game')
        this.player.update(updateInput)
    }

    render(): void {
        // console.log('Rendering game')
        this.player.render(this.canvas.getCanvas())
    }

    loop(): void {
        const time = window.performance.now()
        const delta = time - this.lastTime
        console.log(delta)
        this.processInput()
        this.update({ time, delta })
        this.render()
        this.lastTime = time
        requestAnimationFrame(() => this.loop())
    }
}

new Game()
