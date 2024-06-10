import Vector2 from './Vector2'

export class GameObject {
    protected transform: Transform
    protected velocity: Velocity
    constructor() {
        this.transform = new Transform(500, 500, 0, 1)
        this.velocity = new Velocity(0, new Vector2(0, 0))
    }

    public update(): void {
        let position = this.transform.getPosition()
        let direction = this.velocity.getDirection()
        direction.normalize()
        let speed = this.velocity.getSpeed()
        position.x += direction.x * speed
        position.y += direction.y * speed
    }

    public setPosition(x: number, y: number): void {
        this.transform.setPosition(x, y)
    }

    public setVelocity(speed: number, direction: Vector2): void {
        this.velocity.setSpeed(speed)
        this.velocity.setDirection(direction)
    }

    public render(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let position = this.transform.getPosition()
        console.log(position.x, position.y)
        ctx.fillRect(position.x, position.y, 150, 100)
        ctx.fillStyle = 'red'
    }
}

class Transform {
    private position: Vector2
    private rotation: number = 0
    private scale: number = 1
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
    private speed: number = 0
    private direction: Vector2 = new Vector2(0, 0)
    constructor(speed: number, direction: Vector2) {
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
