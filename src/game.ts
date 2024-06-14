import Player from './Player'
import UpdateInput from './types/update'
import Canvas from './Canvas'
import InputHandler from './engine/InputHandler'
import Obstacle from './Obstacle'
import Vector2 from './engine/Vector2'
import Base from './Base'
import {
    BASE_SPEED,
    BodyType,
    PIPE_DISTANCE,
    PIPE_FLIP_SOURCE,
    PIPE_GAP,
    PIPE_SOURCE,
    PIPE_STARTING_OFFSET,
} from './engine/constants'
import { GameState } from './types/state'
import { GameHomeState } from './State'
import TriggerObject from './engine/TriggerOject'
import ScoreManager from './ScoreManager'

export class Game {
    public player: Player
    public scoreManager: ScoreManager
    public obstacles: Obstacle[][]
    public bases: Base[]
    private lastTime: number
    public canvas: Canvas
    public inputHandler: InputHandler
    public state: GameState
    public hitAudio: HTMLAudioElement
    public triggerAreas: TriggerObject[]
    constructor() {
        console.log('Game created')
        this.player = new Player()
        this.player.setSpeed(300)
        this.player.setDirection(new Vector2(0, 1))
        this.player.setPosition(75, 300)
        this.scoreManager = new ScoreManager()
        this.canvas = new Canvas(450, 800)
        this.obstacleInit()
        this.bases = []
        this.state = new GameHomeState()
        this.state.enter(this)
        for (let i = 0; i < 3; i++) {
            const base = new Base(450, 150, BodyType.STATIC_BODY)
            base.setPosition(i * 450, 650)
            this.bases.push(base)
            base.setSpeed(BASE_SPEED)
            base.setDirection(new Vector2(-1, 0))
        }
        this.inputHandler = new InputHandler(this.canvas.canvas)
        this.hitAudio = document.createElement('audio')
        this.hitAudio.src = 'assets/audio/hit.wav'
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
    }

    processInput(): void {
        const newState = this.state.handleInput(this)
        if (newState !== null) {
            this.state = newState
            this.state.enter(this)
        }
    }

    update(updateInput: UpdateInput): void {
        this.state.update(this, updateInput)
    }

    render(): void {
        this.state.render(this)
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

    obstacleInit(): void {
        this.obstacles = []
        this.triggerAreas = []
        for (let i = 0; i < 3; i++) {
            const obstacle = new Obstacle(104, 640, PIPE_SOURCE, BodyType.STATIC_BODY)
            const randomY = Math.floor(Math.random() * 300) + 200
            obstacle.setPosition(PIPE_STARTING_OFFSET + PIPE_DISTANCE * i, randomY)
            const invertedObstacle = new Obstacle(104, 640, PIPE_FLIP_SOURCE, BodyType.STATIC_BODY)
            invertedObstacle.setPosition(
                PIPE_STARTING_OFFSET + PIPE_DISTANCE * i,
                randomY - invertedObstacle.getHeight() - PIPE_GAP
            )
            console.log(PIPE_STARTING_OFFSET + PIPE_DISTANCE * i)
            const trigger = new TriggerObject(
                104,
                PIPE_GAP,
                PIPE_STARTING_OFFSET + PIPE_DISTANCE * i,
                randomY - PIPE_GAP
            )
            this.obstacles.push([obstacle, invertedObstacle])
            this.triggerAreas.push(trigger)
            obstacle.setSpeed(BASE_SPEED)
            obstacle.setDirection(new Vector2(-1, 0))
            invertedObstacle.setSpeed(BASE_SPEED)
            invertedObstacle.setDirection(new Vector2(-1, 0))
            trigger.setSpeed(BASE_SPEED)
            trigger.setDirection(new Vector2(-1, 0))
        }
    }

    obstacleSpawner(): void {
        if (this.obstacles[0][0].getPosition().x + this.obstacles[0][0].getWidth() < 0) {
            this.obstacles.shift()
            this.triggerAreas.shift()
            const obstacle = new Obstacle(104, 640, PIPE_SOURCE, BodyType.STATIC_BODY)
            const invertedObstacle = new Obstacle(104, 640, PIPE_FLIP_SOURCE, BodyType.STATIC_BODY)
            const lastObstacle = this.obstacles[this.obstacles.length - 1]
            const randomY = Math.floor(Math.random() * 250) + 200
            obstacle.setPosition(lastObstacle[0].getPosition().x + PIPE_DISTANCE, randomY)
            invertedObstacle.setPosition(
                lastObstacle[1].getPosition().x + PIPE_DISTANCE,
                randomY - invertedObstacle.getHeight() - PIPE_GAP
            )
            const trigger = new TriggerObject(
                104,
                PIPE_GAP,
                lastObstacle[1].getPosition().x + PIPE_DISTANCE,
                randomY - PIPE_GAP
            )
            obstacle.setSpeed(BASE_SPEED)
            obstacle.setDirection(new Vector2(-1, 0))
            invertedObstacle.setSpeed(BASE_SPEED)
            invertedObstacle.setDirection(new Vector2(-1, 0))
            trigger.setSpeed(BASE_SPEED)
            trigger.setDirection(new Vector2(-1, 0))
            this.obstacles.push([obstacle, invertedObstacle])
            this.triggerAreas.push(trigger)
        }
    }

    baseSpawner(): void {
        if (this.bases[0].getPosition().x + this.bases[0].getWidth() < 0) {
            this.bases.shift()
            const base = new Base(450, 150, BodyType.STATIC_BODY)
            const lastBase = this.bases[this.bases.length - 1]
            base.setPosition(lastBase.getPosition().x + lastBase.getWidth(), 650)
            base.setSpeed(BASE_SPEED)
            base.setDirection(new Vector2(-1, 0))
            this.bases.push(base)
        }
    }
}

new Game()
