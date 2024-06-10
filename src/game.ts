import { Player } from "./player"

class Game {
    public player: Player
    constructor() {
        console.log('Game created')
        this.player = new Player()
    }

    loop() {
        console.log('Game loop')
    }
}

new Game()
