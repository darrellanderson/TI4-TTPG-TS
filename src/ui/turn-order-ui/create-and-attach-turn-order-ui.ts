import { IGlobal } from "ttpg-darrell";

import { PlayerSeats } from "../../lib/player-lib/player-seats/player-seats";
import { TurnOrderUI } from "./turn-order-ui";

export class CreateAndAttachTurnOrderUI implements IGlobal {
  private readonly _turnOrderUI: TurnOrderUI = new TurnOrderUI();

  constructor() {}

  init() {
    this._turnOrderUI.setPlayerCount(6).attachToScreen();

    if (TI4.turnOrder.getTurnOrder().length === 0) {
      const order: Array<number> = new PlayerSeats()
        .getAllSeats()
        .map((playerSeat) => playerSeat.playerSlot);
      TI4.turnOrder.setTurnOrder(order, "forward", -1);
    }
  }

  destroy(): void {
    this._turnOrderUI.destroy();
  }
}
