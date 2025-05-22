import { Player } from "@tabletop-playground/api";
import { Broadcast, Direction, IGlobal, PlayerSlot } from "ttpg-darrell";
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

    // Update turn order colors.
    const order: Array<PlayerSlot> = TI4.turnOrder.getTurnOrder();
    const direction: Direction = TI4.turnOrder.getDirection();
    const current: PlayerSlot = TI4.turnOrder.getCurrentTurn();
    TI4.turnOrder.setTurnOrder(order, direction, current);
  };

  init(): void {
    TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
  }
}
