import { BoxCollider, Collider } from './Collider'
import Transform from './Transform'
import Vector2 from './Vector2'
import { BodyType, GRAVITAIONAL_ACCELERATION, TriggerState } from './constants'
import UpdateInput from '../types/update'

export class GameObject {
    protected transform: Transform
    protected velocity: Velocity
    public collider: Collider
    public bodyType: BodyType
    public parent: GameObject | null = null
    public children: GameObject[] = []
    private _name: string
    public width: number
    public height: number
    constructor(width: number, height: number, bodyType: BodyType) {
        this.transform = new Transform(0, 0, 0, 1)
        this.velocity = new Velocity()
        this.width = width
        this.height = height
        this.collider = new BoxCollider(
            width,
            height,
            this.transform.getPosition().x,
            this.transform.getPosition().y
        )
        this.bodyType = bodyType
    }

    public get name(): string {
        return this._name
    }

    public set name(name: string) {
        this._name = name
    }

    public getWidth(): number {
        return this.width
    }

    public getHeight(): number {
        return this.height
    }

    public update(updateInput: UpdateInput): void {
        const position = this.transform.getPosition()
        const direction = this.velocity.getDirection().normalize()
        const colliderPosition = this.collider.transform.getPosition()
        const speed = this.velocity.getSpeed()
        position.x += (direction.x * speed * updateInput.delta) / 1000
        position.y += (direction.y * speed * updateInput.delta) / 1000
        const worldPosition = this.getWorldPosition()
        colliderPosition.x = worldPosition.x
        colliderPosition.y = worldPosition.y
        this.children.forEach((child) => {
            child.update(updateInput)
        })
    }

    public triggerUpdate(objects: GameObject[]): TriggerState {
        return TriggerState.OUT
    }
    public updateGravity(updateInput: UpdateInput): void {
        if (this.bodyType === BodyType.RIGID_BODY) {
            this.velocity.setSpeed(
                this.velocity.getSpeed() + (GRAVITAIONAL_ACCELERATION * updateInput.delta) / 1000
            )
            // console.log('Speed:', this.velocity.getSpeed())
        }
    }

    public handleCollision(updateInput: UpdateInput, other: Collider): void {
        // console.log('Collision detected')
        const position = this.transform.getPosition()
        const speed = this.velocity.getSpeed()
        const direction = this.velocity.getDirection().normalize()
        const colliderPosition = this.collider.transform.getPosition()
        const otherPosition = other.transform.getPosition()
        if (
            colliderPosition.x >= otherPosition.x ||
            colliderPosition.x <= otherPosition.x + other.width
        ) {
            position.x = otherPosition.x - 1
        }
        if (
            colliderPosition.y >= otherPosition.y ||
            colliderPosition.y <= otherPosition.y + other.height
        ) {
            position.y = otherPosition.y - 1
        }
    }

    public setPosition(x: number, y: number): void {
        this.transform.setPosition(x, y)
        this.collider.transform.setPosition(x, y)
    }

    public getPosition(): Vector2 {
        return this.transform.getPosition()
    }

    public getWorldPosition(): Vector2 {
        let position = this.transform.getPosition()
        let parent = this.parent
        while (parent) {
            position = position.add(parent.getPosition())
            parent = parent.parent
        }
        return position
    }

    public setVelocity(speed: number, direction: Vector2): void {
        this.velocity.setSpeed(speed)
        this.velocity.setDirection(direction)
    }

    public setSpeed(speed: number): void {
        this.velocity.setSpeed(speed)
    }

    public setDirection(direction: Vector2): void {
        this.velocity.setDirection(direction)
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.children.forEach((child) => {
            child.render(ctx)
        })
    }

    public setCollider(width: number, height: number, x: number, y: number): void {
        const worldPosition = this.getWorldPosition()
        this.collider = new BoxCollider(width, height, worldPosition.x + x, worldPosition.y + y)
    }

    public setRotation(rotation: number): void {
        this.transform.setRotation(rotation)
    }

    public getTransform(): Transform {
        return this.transform
    }

    public setParent(parent: GameObject): void {
        this.parent = parent
        const worldPosition = this.getWorldPosition()
        this.collider.setPosition(worldPosition.x, worldPosition.y)
    }

    public addChild(child: GameObject): void {
        this.children.push(child)
        child.setParent(this)
    }

    public removeChild(child: GameObject): void {
        this.children = this.children.filter((c) => c !== child)
    }
}

class Velocity {
    private speed: number
    private direction: Vector2
    constructor(speed = 0, direction = Vector2.zero) {
        this.speed = speed
        this.direction = direction
    }

    public getSpeed(): number {
        return this.speed
    }

    public getDirection(): Vector2 {
        return this.direction
    }

    public setSpeed(speed: number): void {
        this.speed = speed
    }

    public setDirection(direction: Vector2): void {
        this.direction = direction
    }
}
