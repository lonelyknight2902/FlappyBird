import Renderer from './Renderer'
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
        this.player.setVelocity(0, new Vector2(1, 1))
        this.canvas = new Canvas(800, 600)
        this.inputHandler = new InputHandler()
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
    }

    processInput(): void {
        console.log('Processing input')
        let xSpeed = 0
        let ySpeed = 0
        if(this.inputHandler.isKeyDown('ArrowUp')) {
            console.log('ArrowUp is pressed')
            ySpeed = -1
        } else if(this.inputHandler.isKeyDown('ArrowDown')) {
            console.log('ArrowDown is pressed')
            ySpeed = 1
        } else {
            ySpeed = 0
        }
        if(this.inputHandler.isKeyDown('ArrowLeft')) {
            console.log('ArrowLeft is pressed')
            xSpeed = -1
        } else if(this.inputHandler.isKeyDown('ArrowRight')) {
            console.log('ArrowRight is pressed')
            xSpeed = 1
        } else {
            xSpeed = 0
        }

        this.player.setVelocity(1, new Vector2(xSpeed, ySpeed))
    }

    update(updateInput: UpdateInput): void {
        // console.log('Updating game')
        this.player.update()
    }

    render(): void {
        // console.log('Rendering game')
        this.player.render(this.canvas.getCanvas())
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
