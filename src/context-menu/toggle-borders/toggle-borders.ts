import { globalEvents, Player, world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export const TOGGLE_BORDERS_ACTION: string = "*Toggle Borders";
const TOGGLE_BORDERS_TOOLTIP: string =
  "Display which players control planets and space by color outline";

export class ToggleBorders implements IGlobal {
  private readonly _onCustomActionHandler = (
    player: Player,
    identifier: string
  ): void => {
    if (identifier === TOGGLE_BORDERS_ACTION) {
      TI4.borders.toggleVisibility(player.getSlot());
    }
  };

  init(): void {
    world.addCustomAction(TOGGLE_BORDERS_ACTION, TOGGLE_BORDERS_TOOLTIP);
    globalEvents.onCustomAction.add(this._onCustomActionHandler);
  }
}
