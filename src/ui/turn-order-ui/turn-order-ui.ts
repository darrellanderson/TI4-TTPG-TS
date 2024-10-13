import {
  TurnEntryWart,
  TurnEntryWidget,
  TurnOrder,
  TurnOrderWidget,
  TurnOrderWidgetParams,
} from "ttpg-darrell";
import { TurnOrderEntry } from "./turn-order-entry";

export class TurnOrderUI {
  private readonly _params: TurnOrderWidgetParams = {
    entryWidth: 220,
    entryHeight: 58,
    nameBox: {
      width: 130,
      height: 30,
      left: 45,
      top: 0,
    },
    reserveSlots: 8,
    toggleEliminated: true,
    togglePassed: true,
    wartGenerators: [
      (turnEntryWidget: TurnEntryWidget): TurnEntryWart => {
        return new TurnOrderEntry(turnEntryWidget);
      },
    ],
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
