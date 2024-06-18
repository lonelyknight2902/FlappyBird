import Base from './Base'
import Canvas from './Canvas'
import Obstacle from './Obstacle'
import Player from './Player'
import ScoreManager from './ScoreManager'
import { GameHomeState } from './states/game-states'
import { GameObject, TriggerObject } from '../engine/game-objects'
import { Scene } from '../engine/scenes'
import { Vector2 } from '../engine/utils'
import {
    PIPE_SOURCE,
    PIPE_STARTING_OFFSET,
    PIPE_DISTANCE,
    PIPE_FLIP_SOURCE,
    PIPE_GAP,
    BASE_SPEED,
} from './constants'
import { GameState } from '../types/state'
import UpdateInput from '../types/update'
import { BodyType } from '../engine/constants'

class GameScene extends Scene {
    public player: Player
    public scoreManager: ScoreManager
    public obstacles: GameObject
    public triggerAreas: GameObject[]
    public bases: GameObject
    public state: GameState
    public hitAudio: HTMLAudioElement
    public canvas: Canvas
    constructor(canvas: Canvas) {
        super()
        console.log('GameScene created')
        this.player = Player.getInstance()
        this.player.setDirection(new Vector2(0, 1))
        this.player.setPosition(75, 300)
        this.addGameObject(this.player)
        this.scoreManager = new ScoreManager()
        this.bases = new GameObject(0, 0, BodyType.STATIC_BODY, 'Bases')
        this.addGameObject(this.bases)
        this.obstacles = new GameObject(0, 0, BodyType.STATIC_BODY, 'Obstacles')
        this.addGameObject(this.obstacles)
        this.state = new GameHomeState()
        this.state.enter(this)
        for (let i = 0; i < 3; i++) {
            const base = new Base(450, 150, BodyType.STATIC_BODY)
            base.setPosition(i * 450, 650)
            this.bases.children.push(base)
            base.setSpeed(BASE_SPEED)
            base.setDirection(new Vector2(-1, 0))
            base.setParent(this.bases)
        }
        this.hitAudio = document.createElement('audio')
        this.hitAudio.src = 'assets/audio/hit.wav'
        this.canvas = canvas
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

    initObstacle(): void {
        this.triggerAreas = []
        for (let i = 0; i < 3; i++) {
            const parent = new GameObject(0, 0, BodyType.STATIC_BODY)
            const randomY = Math.floor(Math.random() * 300) + 200
            parent.setPosition(PIPE_STARTING_OFFSET + PIPE_DISTANCE * i, randomY)
            const obstacle = new Obstacle(104, 640, PIPE_SOURCE, BodyType.STATIC_BODY)
            const invertedObstacle = new Obstacle(104, 640, PIPE_FLIP_SOURCE, BodyType.STATIC_BODY)
            obstacle.setPosition(0, 0)
            invertedObstacle.setPosition(0, -invertedObstacle.getHeight() - PIPE_GAP)
            const trigger = new TriggerObject(104, PIPE_GAP, 0, -PIPE_GAP)
            parent.addChild(obstacle)
            parent.addChild(invertedObstacle)
            parent.addChild(trigger)
            obstacle.setParent(parent)
            trigger.setParent(parent)
            invertedObstacle.setParent(parent)
            trigger.setCollider(104, PIPE_GAP, 0, -PIPE_GAP)
            obstacle.setCollider(104, 640, 0, 0)
            invertedObstacle.setCollider(104, 640, 0, -invertedObstacle.getHeight() - PIPE_GAP)
            this.obstacles.children.push(parent)
            parent.setParent(this.obstacles)
            parent.setSpeed(BASE_SPEED)
            parent.setDirection(new Vector2(-1, 0))
        }
    }

    obstacleSpawner(): void {
        if (
            this.obstacles.children[0].getPosition().x +
                this.obstacles.children[0].children[0].getWidth() <
            0
        ) {
            const obstacle = this.obstacles.children.shift()
            const trigger = this.triggerAreas.shift()
            const lastObstacle = this.obstacles.children[this.obstacles.children.length - 1]
            const randomY = Math.floor(Math.random() * 250) + 200
            obstacle?.setPosition(lastObstacle.getWorldPosition().x + PIPE_DISTANCE, randomY)
            if (obstacle) {
                this.obstacles.children.push(obstacle)
            }
            if (trigger) {
                this.triggerAreas.push(trigger)
            }
        }
    }

    baseSpawner(): void {
        if (this.bases.children[0].getPosition().x + this.bases.children[0].getWidth() < 0) {
            const base = this.bases.children.shift()
            const lastBase = this.bases.children[this.bases.children.length - 1]
            base?.setPosition(lastBase.getPosition().x + lastBase.getWidth(), 650)
            base?.setSpeed(BASE_SPEED)
            base?.setDirection(new Vector2(-1, 0))
            if (base) {
                this.bases.children.push(base)
            }
            base?.setParent(this.bases)
        }
    }
}

export default GameScene
