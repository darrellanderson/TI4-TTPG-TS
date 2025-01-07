import { Player } from "@tabletop-playground/api";
import { Broadcast, IGlobal } from "ttpg-darrell";
import { ChangeColor } from "../../lib/player-lib/change-color/change-color";

/**
 * Apply the player changed color event.
 */
export class OnPlayerChangedColor implements IGlobal {
  public readonly _onPlayerChangedColorHandler = (
    playerSlot: number,
    colorName: string,
    colorHex: string,
    clickingPlayer: Player
  ) => {
    const msg: string = `${clickingPlayer.getName()} changed a player's color`;
    Broadcast.chatAll(msg);
    new ChangeColor(playerSlot).changeColor(colorName, colorHex);
  };

  init(): void {
    TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
  }
}
