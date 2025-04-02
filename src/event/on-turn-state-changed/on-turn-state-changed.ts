import { Broadcast, IGlobal, PlayerSlot, TurnOrder } from "ttpg-darrell";

export class OnTurnStateChanged implements IGlobal {
  private readonly _onTurnStateChanged = (turnOrder: TurnOrder): void => {
    // If all players have passed, reset passed and inform.
    const playerSlots: Array<PlayerSlot> = turnOrder.getTurnOrder();
    const activeIndex: number = playerSlots.findIndex(
      (playerSlot: PlayerSlot) => turnOrder.getPassed(playerSlot) === false
    );
    if (activeIndex === -1) {
      playerSlots.forEach((playerSlot: PlayerSlot) => {
        turnOrder.setPassed(playerSlot, false);
      });
      const msg: string = "All players have passed";
      Broadcast.broadcastAll(msg);
    }
  };

  init(): void {
    TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
  }

  destroy(): void {
    TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);
  }
}
