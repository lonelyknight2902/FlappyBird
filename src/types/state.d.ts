import { Game } from "../game";
import UpdateInput from "./update";

export interface GameState {
  handleInput(game: Game): GameState | null;
  update(game: Game, updateInput: UpdateInput): void;
  render(game: Game): void;
  enter(game: Game): void;
  exit(game: Game): void;
}

