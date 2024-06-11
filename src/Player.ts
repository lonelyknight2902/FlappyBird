import { GameObject } from './GameObject'

class Player extends GameObject {
    private sprite: HTMLImageElement
    private spriteSource: string
    constructor() {
        super()
        console.log(this.velocity)
        console.log('Player created')
    }
}

export default Player
