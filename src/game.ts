import Renderer from "./Renderer"
import Player from "./Player"
import UpdateInput from "./types/update"

export class Game {
    public player: Player
    private renderer: Renderer
    private lastTime: number
    constructor() {
        console.log('Game created')
        this.player = new Player()
        this.renderer = new Renderer()
        this.lastTime = window.performance.now()
        requestAnimationFrame(() => this.loop())
    }

    processInput(): void {
        console.log('Processing input')
    }

    update(updateInput: UpdateInput): void {
        console.log('Updating game')
    }

    render(): void {
        console.log('Rendering game')
    }

    loop(): void {
        const time = window.performance.now()
        const delta = time - this.lastTime
        this.processInput()
        this.update({ time, delta })
        this.render()
        this.lastTime = time
        requestAnimationFrame(() => this.loop())
    }
}

new Game()