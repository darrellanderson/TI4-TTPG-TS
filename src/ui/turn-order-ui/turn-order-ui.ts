import {
  TurnOrder,
  TurnOrderWidget,
  TurnOrderWidgetParams,
} from "ttpg-darrell";

export class TurnOrderUI {
  private readonly _params: TurnOrderWidgetParams = {
    entryWidth: 220,
    entryHeight: 58,
    reserveSlots: 8,
    toggleEliminated: true,
    togglePassed: true,
  };

  setPlayerCount(playerCount: number): this {
    this._params.reserveSlots = playerCount;
    return this;
  }

  attachToScreen(): void {
    const turnOrder: TurnOrder = TI4.turnOrder;
    new TurnOrderWidget(turnOrder, this._params).attachToScreen();
  }
}
