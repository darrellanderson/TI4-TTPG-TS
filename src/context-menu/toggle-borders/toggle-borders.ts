import { globalEvents, Player, world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

const ACTION: string = "*Toggle borders";
const TOOLTIP: string =
  "Display which players control planets and space by color outline";

export class ToggleBorders implements IGlobal {
  private readonly _onCustomActionHandler = (
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION) {
      TI4.borders.toggleVisibility(player.getSlot());
    }
  };

  init(): void {
    world.addCustomAction(ACTION, TOOLTIP);
    globalEvents.onCustomAction.add(this._onCustomActionHandler);
  }
}
