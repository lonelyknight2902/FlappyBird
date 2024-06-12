import Player from './Player'
import UpdateInput from './types/update'
import Canvas from './Canvas'
// import Vector2 from './Vector2'
import InputHandler from './InputHandler'
import Obstacle from './Obstacle'
import Vector2 from './Vector2'
import Base from './Base'
import {
    BASE_SPEED,
    BodyType,
    PIPE_DISTANCE,
    PIPE_FLIP_SOURCE,
    PIPE_GAP,
    PIPE_SOURCE,
} from './constants'
import { GameState } from './types/state'
import { GameStartState } from './State'

export class Game {
    public player: Player
    public obstacles: Obstacle[][]
    public bases: Base[]
    private lastTime: number
    private canvas: Canvas
    public inputHandler: InputHandler
    public state: GameState
    public hitAudio: HTMLAudioElement
    constructor() {
        console.log('Game created')
        this.player = new Player()
        this.player.setSpeed(300)
        this.player.setDirection(new Vector2(0, 1))
        this.player.setPosition(75, 300)
        this.canvas = new Canvas(450, 800)
        this.obstacleInit()
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
        this.hitAudio = document.createElement('audio')
        this.hitAudio.src = 'assets/audio/hit.wav'
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
            obstacle[0].render(ctx)
            obstacle[1].render(ctx)
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

    obstacleInit(): void {
        this.obstacles = []
        for (let i = 0; i < 3; i++) {
            const obstacle = new Obstacle(104, 640, PIPE_SOURCE, BodyType.STATIC_BODY)
            const randomY = Math.floor(Math.random() * 300) + 200
            obstacle.setPosition(450 + PIPE_DISTANCE * i, randomY)
            const invertedObstacle = new Obstacle(104, 640, PIPE_FLIP_SOURCE, BodyType.STATIC_BODY)
            invertedObstacle.setPosition(
                450 + PIPE_DISTANCE * i,
                randomY - invertedObstacle.getHeight() - PIPE_GAP
            )
            this.obstacles.push([obstacle, invertedObstacle])
            obstacle.setSpeed(BASE_SPEED)
            obstacle.setDirection(new Vector2(-1, 0))
            invertedObstacle.setSpeed(BASE_SPEED)
            invertedObstacle.setDirection(new Vector2(-1, 0))
        }
    }

    obstacleSpawner(): void {
        console.log(this.obstacles)
        if (this.obstacles[0][0].getPosition().x + this.obstacles[0][0].getWidth() < 0) {
            this.obstacles.shift()
            const obstacle = new Obstacle(104, 640, PIPE_SOURCE, BodyType.STATIC_BODY)
            const invertedObstacle = new Obstacle(104, 640, PIPE_FLIP_SOURCE, BodyType.STATIC_BODY)
            const lastObstacle = this.obstacles[this.obstacles.length - 1]
            const randomY = Math.floor(Math.random() * 250) + 200
            obstacle.setPosition(lastObstacle[0].getPosition().x + PIPE_DISTANCE, randomY)
            invertedObstacle.setPosition(
                lastObstacle[1].getPosition().x + PIPE_DISTANCE,
                randomY - invertedObstacle.getHeight() - PIPE_GAP
            )
            obstacle.setSpeed(BASE_SPEED)
            obstacle.setDirection(new Vector2(-1, 0))
            invertedObstacle.setSpeed(BASE_SPEED)
            invertedObstacle.setDirection(new Vector2(-1, 0))
            this.obstacles.push([obstacle, invertedObstacle])
        }
    }

    baseSpawner(): void {
        if (this.bases[0].getPosition().x + this.bases[0].getWidth() < 0) {
            console.log('Shifting base')
            this.bases.shift()
            const base = new Base(450, 150, BodyType.STATIC_BODY)
            const lastBase = this.bases[this.bases.length - 1]
            base.setPosition(lastBase.getPosition().x + lastBase.getWidth(), 650)
            base.setSpeed(BASE_SPEED)
            base.setDirection(new Vector2(-1, 0))
            this.bases.push(base)
            console.log(this.bases)
        }
    }
}

new Game()
