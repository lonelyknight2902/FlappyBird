import Player from './Player'
import UpdateInput from './types/update'
import Canvas from './Canvas'
// import Vector2 from './Vector2'
import InputHandler from './InputHandler'
import Obstacle from './Obstacle'
import Vector2 from './Vector2'
import Base from './Base'
import { BASE_SPEED, BodyType } from './constants'
import { GameState } from './types/state'
import { GameStartState } from './State'

export class Game {
    public player: Player
    public obstacles: Obstacle[]
    public bases: Base[]
    private lastTime: number
    private canvas: Canvas
    public inputHandler: InputHandler
    public state: GameState
    constructor() {
        console.log('Game created')
        this.player = new Player()
        this.player.setSpeed(300)
        this.player.setDirection(new Vector2(0, 1))
        this.player.setPosition(75, 300)
        this.canvas = new Canvas(450, 800)
        const obstacle = new Obstacle()
        obstacle.setPosition(170, 200)
        this.obstacles = [obstacle]
        this.bases = []
        this.state = new GameStartState()
        for (let i = 0; i < 3; i++) {
            const base = new Base(450, 150, BodyType.STATIC_BODY)
            base.setPosition(i * 450, 650)
            this.bases.push(base)
            base.setSpeed(BASE_SPEED)
            base.setDirection(new Vector2(-1, 0))
        }
        this.inputHandler = new InputHandler()
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
    }

    processInput(): void {
        // let xDirection = 0
        // let yDirection = 0
        // if (this.inputHandler.isKeyDown('ArrowUp')) {
        //     yDirection = -1
        // } else if (this.inputHandler.isKeyDown('ArrowDown')) {
        //     yDirection = 1
        // }
        // if (this.inputHandler.isKeyDown('ArrowLeft')) {
        //     xDirection = -1
        // } else if (this.inputHandler.isKeyDown('ArrowRight')) {
        //     xDirection = 1
        // }
        const newState = this.state.handleInput(this)
        if (newState !== null) {
            this.state = newState
        }
        // this.player.setDirection(new Vector2(xDirection, yDirection))
        // this.player.setVelocity(5, new Vector2(xDirection, yDirection))
    }

    update(updateInput: UpdateInput): void {
        // console.log('Updating game')
        this.state.update(this, updateInput)
    }

    render(): void {
        // console.log('Rendering game')
        const canvas = this.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.canvas.renderBackground()
        this.player.render(ctx)
        this.obstacles.forEach((obstacle) => {
            obstacle.render(ctx)
        })
        this.bases.forEach((base) => {
            base.render(ctx)
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
