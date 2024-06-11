import { BoxCollider, Collider } from './Collider'
import Transform from './Transform'
import Vector2 from './Vector2'
import { BodyType, GRAVITAIONAL_ACCELERATION } from './constants'
import UpdateInput from './types/update'

export class GameObject {
    protected transform: Transform
    protected velocity: Velocity
    public collider: Collider
    public bodyType: BodyType
    constructor(width: number, height: number, bodyType: BodyType) {
        this.transform = new Transform(0, 0, 0, 1)
        this.velocity = new Velocity()
        this.collider = new BoxCollider(
            width,
            height,
            this.transform.getPosition().x,
            this.transform.getPosition().y
        )
        this.bodyType = bodyType
    }

    public update(updateInput: UpdateInput): void {
        const position = this.transform.getPosition()
        const direction = this.velocity.getDirection().normalize()
        const colliderPosition = this.collider.transform.getPosition()
        const speed = this.velocity.getSpeed()
        position.x += (direction.x * speed * updateInput.delta) / 1000
        position.y += (direction.y * speed * updateInput.delta) / 1000
        colliderPosition.x = position.x
        colliderPosition.y = position.y
        if (this.bodyType === BodyType.RIGID_BODY) {
            this.velocity.setSpeed(
                this.velocity.getSpeed() + (GRAVITAIONAL_ACCELERATION * updateInput.delta) / 1000
            )
            console.log('Speed:', this.velocity.getSpeed())
        }
    }

    public handleCollision(updateInput: UpdateInput, other: Collider): void {
        console.log('Collision detected')
        const position = this.transform.getPosition()
        const speed = this.velocity.getSpeed()
        const direction = this.velocity.getDirection().normalize()
        const colliderPosition = this.collider.transform.getPosition()
        const otherPosition = other.transform.getPosition()
        if (
            colliderPosition.x >= otherPosition.x ||
            colliderPosition.x <= otherPosition.x + other.width
        ) {
            position.x -= (speed * direction.x * updateInput.delta) / 1000
        }
        if (
            colliderPosition.y >= otherPosition.y ||
            colliderPosition.y <= otherPosition.y + other.height
        ) {
            position.y -= (speed * direction.y * updateInput.delta) / 1000
        }
    }

    public setPosition(x: number, y: number): void {
        this.transform.setPosition(x, y)
        this.collider.transform.setPosition(x, y)
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
        const position = this.transform.getPosition()
        ctx.fillRect(position.x, position.y, 150, 100)
        ctx.fillStyle = 'red'
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
