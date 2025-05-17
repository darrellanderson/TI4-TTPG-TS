import { globalEvents, Player, world } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export const TOGGLE_BORDERS_ACTION: string = "*Toggle Borders";

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
    world.addCustomAction(
      TOGGLE_BORDERS_ACTION,
      TI4.locale("tooltip.toggle-borders")
    );
    globalEvents.onCustomAction.add(this._onCustomActionHandler);
  }
}
