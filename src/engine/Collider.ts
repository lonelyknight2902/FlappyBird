import Transform from './Transform'
import Vector2 from './Vector2'

export abstract class Collider {
    transform: Transform
    width: number
    height: number
    abstract checkCollision(other: Collider): boolean
    abstract checkCollisionWithCircle(other: CircleCollider): boolean
    abstract checkCollisionWithBox(other: BoxCollider): boolean
    abstract setPosition(x: number, y: number): void
}

export class CircleCollider extends Collider {
    public transform: Transform
    private _center: Vector2
    private _radius: number

    constructor(center: Vector2, radius: number) {
        super()
        this._center = center
        this._radius = radius
    }

    public checkCollision(other: Collider): boolean {
        return other.checkCollisionWithCircle(this)
    }

    public checkCollisionWithCircle(other: CircleCollider): boolean {
        return this._center.distanceTo(other._center) < this._radius + other._radius
    }

    public checkCollisionWithBox(other: BoxCollider): boolean {
        const closestPoint = other.getClosestPoint(this._center)
        return this._center.distanceTo(closestPoint) < this._radius
    }

    public getClosestPoint(point: Vector2): Vector2 {
        const direction = this._center.directionTo(point)
        return this._center.add(direction.normalize().multiply(this._radius))
    }

    public get center(): Vector2 {
        return this._center
    }

    public get radius(): number {
        return this._radius
    }

    public setPosition(x: number, y: number): void {
        this._center = new Vector2(x, y)
    }
}

export class BoxCollider extends Collider {
    public transform: Transform
    public width: number
    public height: number

    constructor(width: number, height: number, x: number, y: number) {
        super()
        this.width = width
        this.height = height
        this.transform = new Transform(x, y, 0, 1)
    }

    public getClosestPoint(point: Vector2): Vector2 {
        const x = Math.max(0, Math.min(point.x, this.width))
        const y = Math.max(0, Math.min(point.y, this.height))
        return new Vector2(x, y)
    }

    public checkCollision(other: Collider): boolean {
        if (other instanceof CircleCollider) {
            return this.checkCollisionWithCircle(other)
        } else if (other instanceof BoxCollider) {
            return this.checkCollisionWithBox(other)
        }
        return false
    }

    public checkCollisionWithCircle(other: CircleCollider): boolean {
        return this.getClosestPoint(other.center).distanceTo(other.center) < other.radius
    }

    public checkCollisionWithBox(other: BoxCollider): boolean {
        const position = this.transform.getPosition()
        // console.log(position)
        const otherPosition = other.transform.getPosition()
        // console.log(otherPosition)
        return (
            position.x < otherPosition.x + other.width &&
            position.x + this.width > otherPosition.x &&
            position.y < otherPosition.y + other.height &&
            position.y + this.height > otherPosition.y
        )
    }

    public setPosition(x: number, y: number): void {
        this.transform.setPosition(x, y)
    }
}
