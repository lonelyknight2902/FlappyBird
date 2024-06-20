import { BASE_SPEED, ROTATION_ACCERATION } from '../../constants'
import { TriggerState } from '../../../engine/constants'
import { TriggerObject } from '../../../engine/game-objects'
import { InputHandler } from '../../../engine/inputs'
import { TextElement } from '../../../engine/user-interface'
import { GameState } from '../../../types/state'
import UpdateInput from '../../../types/update'
import GameScene from '../../GameScene'
import GameOverState from './GameOverState'

class GamePlayState implements GameState {
    private _scoreText: TextElement
    handleInput(game: GameScene): GameState | null {
        const inputHandler = InputHandler.getInstance(game.canvas.canvas)
        if (inputHandler.isKeyDown('Space') || inputHandler.isTouchStart()) {
            game.player.flap()
            return null
        }
        game.player.unflap()
        return null
    }

    update(game: GameScene, updateInput: UpdateInput): void {
        game.canvas.update(updateInput)
        game.gameObjects.forEach((obj) => {
            obj.update(updateInput)
            obj.updateGravity(updateInput)
        })
        game.baseSpawner()
        game.obstacleSpawner()
        let collision = false
        for (const obstacle of game.obstacles.children) {
            if (
                game.player.collider.checkCollision(obstacle.children[0].collider) ||
                game.player.collider.checkCollision(obstacle.children[1].collider)
            ) {
                console.log('Obstacle Collision detected')
                console.log(game.player.collider)
                console.log(obstacle.children[0].collider)
                // game.player.handleCollision(updateInput, obstacle[0].collider)
                collision = true
                break
            }

            if (
                obstacle.children
                    .filter((obj) => obj instanceof TriggerObject)[0]
                    .triggerUpdate([game.player]) === TriggerState.EXIT
            ) {
                game.scoreManager.increaseScore()
                this._scoreText.setText(game.scoreManager.score.toString())
            }
        }

        for (const base of game.bases.children) {
            if (game.player.collider.checkCollision(base.collider)) {
                console.log('Base Collision detected')
                // game.player.handleCollision(updateInput, base.collider))
                const position = game.player.getPosition()
                game.player.setPosition(position.x, base.getPosition().y - game.player.height)
                collision = true
            }
        }

        if (
            game.player.getPosition().y <= 0 ||
            game.player.getPosition().y >= game.canvas.canvas.height
        ) {
            collision = true
        }

        if (collision) {
            game.hitAudio.currentTime = 0.06
            game.hitAudio.play()
            game.state = new GameOverState()
            game.state.enter(game)
        }
    }

    render(game: GameScene): void {
        const canvas = game.canvas.canvas
        const ctx = canvas.getContext('2d')
        if (ctx === null) {
            return
        }
        game.canvas.clear()
        game.canvas.renderBackground()
        game.obstacles.children.forEach((obstacle) => {
            obstacle.render(ctx)
        })
        game.player.render(ctx)
        game.bases.children.forEach((base) => {
            base.render(ctx)
        })
        this._scoreText.render(ctx)
    }

    enter(game: GameScene): void {
        game.player.flap()
        game.player.setRotationAcceleration(ROTATION_ACCERATION)
        this._scoreText = new TextElement(
            game.canvas.canvas.width / 2,
            200,
            100,
            100,
            game.scoreManager.score.toString(),
            'Flappy Bird',
            40,
            '',
            true
        )
        this._scoreText.textStroke = true
        game.obstacles.children.forEach((obstacle) => {
            obstacle.setSpeed(BASE_SPEED)
        })
    }
    exit(game: GameScene): void {
        return
    }
}

export default GamePlayState
