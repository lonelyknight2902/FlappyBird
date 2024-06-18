class Vector2 {
    public x: number
    public y: number
    public static zero: Vector2 = new Vector2(0, 0)
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    public normalize(): Vector2 {
        if (this.magnitude() === 0) {
            return this
        }
        const normalizeX = this.x / this.magnitude()
        const normalizeY = this.y / this.magnitude()
        return new Vector2(normalizeX, normalizeY)
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    public distanceTo(other: Vector2): number {
        const x = this.x - other.x
        const y = this.y - other.y
        return Math.sqrt(x * x + y * y)
    }

    public directionTo(other: Vector2): Vector2 {
        return new Vector2(other.x - this.x, other.y - this.y)
    }

    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y)
    }

    public multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar)
    }
}

export default Vector2
