import { Broadcast, IGlobal, PlayerSlot, TurnOrder } from "ttpg-darrell";

/**
 * Clear passed state when all players have passed.
 */
export class OnTurnStateChanged implements IGlobal {
  private readonly _onTurnStateChanged = (turnOrder: TurnOrder): void => {
    // If all players have passed, reset passed and inform.
    const playerSlots: Array<PlayerSlot> = turnOrder.getTurnOrder();
    const activeIndex: number = playerSlots.findIndex(
      (playerSlot: PlayerSlot) => turnOrder.getPassed(playerSlot) === false
    );
    if (activeIndex === -1 && playerSlots.length > 0) {
      playerSlots.forEach((playerSlot: PlayerSlot) => {
        turnOrder.setPassed(playerSlot, false);
      });
      const msg: string = "All players have passed";
      Broadcast.broadcastAll(msg);
      TI4.events.onAllPlayersPassed.trigger();
    }

    // If the active player passes, end turn.
    const currentPlayer: PlayerSlot = turnOrder.getCurrentTurn();
    const isCurrentPlayerPassed: boolean = turnOrder.getPassed(currentPlayer);
    if (isCurrentPlayerPassed) {
      turnOrder.nextTurn();
    }
  };

  init(): void {
    TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
  }

  destroy(): void {
    TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);
  }
}
