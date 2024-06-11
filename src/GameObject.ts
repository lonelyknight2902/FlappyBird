import Vector2 from './Vector2'
import UpdateInput from './types/update'

export class GameObject {
    protected transform: Transform
    protected velocity: Velocity
    constructor() {
        this.transform = new Transform(500, 500, 0, 1)
        this.velocity = new Velocity()
    }

    public update(updateInput: UpdateInput): void {
        const position = this.transform.getPosition()
        const direction = this.velocity.getDirection()
        direction.normalize()
        const speed = this.velocity.getSpeed()
        position.x += direction.x * speed * updateInput.delta / 1000
        position.y += direction.y * speed * updateInput.delta / 1000
    }

    public setPosition(x: number, y: number): void {
        this.transform.setPosition(x, y)
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

    public render(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const position = this.transform.getPosition()
        ctx.fillRect(position.x, position.y, 150, 100)
        ctx.fillStyle = 'red'
    }
}

class Transform {
    private position: Vector2
    private rotation: number
    private scale: number
    constructor(positionX: number, positionY: number, rotation: number, scale: number) {
        this.position = new Vector2(positionX, positionY)
        this.rotation = rotation
        this.scale = scale
    }

    public getPosition(): Vector2 {
        return this.position
    }

    public setPosition(x: number, y: number): void {
        this.position.x = x
        this.position.y = y
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
