import { PlayerState } from "../../../types/state"
import Player from "../../Player"

class PlayerAliveState implements PlayerState {
  render(player: Player, ctx: CanvasRenderingContext2D): void {
      // const current = Date.now()
      // if (current - player.start > FLAP_RATE) {
      //     player.start = current
      //     player.currentFrame++
      //     if (player.currentFrame > player.spriteCycle.length - 1) player.currentFrame = 0
      // }
      // const currentSprite = player.sprite[player.spriteCycle[player.currentFrame]]
      const currentSprite = player.animation.currentFrame
      const position = player.getPosition()
      ctx.save()
      ctx.translate(position.x + player.width / 2, position.y + player.height / 2)
      const rotation = player.getTransform().getRotation() * (Math.PI / 180)
      ctx.rotate(rotation)
      ctx.translate(-position.x - player.width / 2, -position.y - player.height / 2)
      ctx.drawImage(currentSprite, position.x, position.y, 68, 48)
      ctx.restore()
  }

  enter(player: Player): void {
    player.animation.play(true)
  }
  exit(player: Player): void {
    return
  }
}

export default PlayerAliveState