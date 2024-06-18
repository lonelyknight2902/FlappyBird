import { PlayerState } from "../../../types/state"
import Player from "../../Player"

class PlayerDeadState implements PlayerState {
  render(player: Player, ctx: CanvasRenderingContext2D): void {
      const currentSprite = player.sprite[player.spriteCycle[player.currentFrame]]
      const position = player.getPosition()
      ctx.save()
      ctx.translate(position.x + player.width / 2, position.y + player.height / 2)
      const rotation = player.getTransform().getRotation() * (Math.PI / 180)
      ctx.rotate(rotation)
      ctx.translate(-position.x - player.width / 2, -position.y - player.height / 2)
      ctx.drawImage(currentSprite, position.x, position.y, 68, 48)
      ctx.restore()
  }
}

export default PlayerDeadState