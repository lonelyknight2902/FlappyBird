import GameScene from "../GameScene";
import Player from "../Player";
import { Game } from "../game";
import UpdateInput from "./update";

export interface GameState {
  handleInput(game: GameScene): GameState | null;
  update(game: GameScene, updateInput: UpdateInput): void;
  render(game: GameScene): void;
  enter(game: GameScene): void;
  exit(game: GameScene): void;
}

export interface PlayerState {
  render(player: Player, ctx: CanvasRenderingContext2D): void;
}
