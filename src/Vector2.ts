class Vector2 {
  public x: number = 0
  public y: number = 0
  constructor(x: number, y: number) {
      this.x = x
      this.y = y
  }

  public normalize(): void {
      if(this.magnitude() === 0) {
          return
      }
      let normalizeX = this.x / this.magnitude()
      let normalizeY = this.y / this.magnitude()
      this.x = normalizeX
      this.y = normalizeY
  }

  public magnitude(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

export default Vector2