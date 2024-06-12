import { Game } from './game'
import { GameState } from './types/state'
import UpdateInput from './types/update'

export class GameStartState implements GameState {
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space')) {
            return new GamePlayState()
        }
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        game.bases.forEach((base) => {
            base.update(updateInput)
        })
        game.baseSpawner()
    }
}

export class GamePlayState implements GameState {
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space')) {
            game.player.flap()
            return null
        }
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        game.player.update(updateInput)
        game.bases.forEach((base) => {
            base.update(updateInput)
        })
        game.obstacles.forEach((obstacle) => {
            obstacle[0].update(updateInput)
            obstacle[1].update(updateInput)
        })
        game.baseSpawner()
        game.obstacleSpawner()
        for (const obstacle of game.obstacles) {
            if (game.player.collider.checkCollision(obstacle[0].collider)) {
                console.log('Collision detected')
                game.player.handleCollision(updateInput, obstacle[0].collider)
                game.state = new GameOverState()
            } else if (game.player.collider.checkCollision(obstacle[1].collider)) {
                console.log('Collision detected')
                // game.player.handleCollision(updateInput, obstacle[1].collider)
                game.state = new GameOverState()
            }
        }

        for (const base of game.bases) {
            if (game.player.collider.checkCollision(base.collider)) {
                console.log('Collision detected')
                // game.player.handleCollision(updateInput, base.collider)
                game.player.setSpeed(0)
                game.state = new GameOverState()
            }
        }

        game.player.updateGravity(updateInput)
    }
}

export class GameOverState {
    handleInput(game: Game): GameState | null {
        if (game.inputHandler.isKeyDown('Space')) {
            game.player.setPosition(75, 300)
            game.obstacleInit()
            return new GameStartState()
        }
        return null
    }

    update(game: Game, updateInput: UpdateInput): void {
        console.log('Game over')
    }
}
