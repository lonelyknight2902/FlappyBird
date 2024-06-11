import { GameObject } from "./GameObject";

class Obstacle extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    constructor() {
        super()
        console.log(this.velocity)
        console.log('Obstacle created')
    }
}

export default Obstacle