class Vector2 {
    public x: number
    public y: number
    public static zero: Vector2 = new Vector2(0, 0)
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    public normalize(): void {
        if (this.magnitude() === 0) {
            return
        }
        const normalizeX = this.x / this.magnitude()
        const normalizeY = this.y / this.magnitude()
        this.x = normalizeX
        this.y = normalizeY
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}

export default Vector2
