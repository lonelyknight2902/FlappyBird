import Player from './Player'
import UpdateInput from './types/update'
import Canvas from './Canvas'
import Vector2 from './Vector2'
import InputHandler from './InputHandler'
import Obstacle from './Obstacle'

export class Game {
    public player: Player
    public obstacles: Obstacle[]
    private lastTime: number
    private canvas: Canvas
    private inputHandler: InputHandler
    constructor() {
        console.log('Game created')
        this.player = new Player()
        this.player.setSpeed(100)
        this.player
        this.canvas = new Canvas(800, 600)
        const obstacle = new Obstacle()
        obstacle.setPosition(500, 500)
        this.obstacles = [obstacle]
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
        for (const obstacle of this.obstacles) {
            if (this.player.collider.checkCollision(obstacle.collider)) {
                console.log('Collision detected')
                this.player.handleCollision(updateInput, obstacle.collider)
            }
        }
    }

    render(): void {
        // console.log('Rendering game')
        const canvas = this.canvas.getCanvas()
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.player.render(ctx)
        this.obstacles.forEach((obstacle) => {
            obstacle.render(ctx)
        })
    }

    loop(): void {
        const time = window.performance.now()
        const delta = time - this.lastTime
        // console.log(delta)
        this.processInput()
        this.update({ time, delta })
        this.render()
        this.lastTime = time
        requestAnimationFrame(() => this.loop())
    }
}

new Game()
