import {
  TurnEntryWart,
  TurnEntryWidget,
  TurnOrder,
  TurnOrderWidget,
  TurnOrderWidgetParams,
} from "ttpg-darrell";
import { TurnOrderEntry } from "./turn-order-entry";
import { Player } from "@tabletop-playground/api";

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
    customActions: [
      {
        name: "Change color",
      },
    ],
    onCustomAction: (
      clickingPlayer: Player,
      identifier: string,
      targetPlayerSlot: number
    ) => {
      if (identifier === "Change color") {
        TI4.events.onPlayerChangeColorRequest.trigger(
          targetPlayerSlot,
          clickingPlayer
        );
      }
    },
  };

  private _onPlayerChangedColorHandler = () => {
    if (this._turnOrderWidget) {
      this._turnOrderWidget.update();
    }
  };

  private _turnOrderWidget: TurnOrderWidget | undefined;

  constructor() {
    TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
  }

  getParams(): TurnOrderWidgetParams {
    return this._params;
  }

  setPlayerCount(playerCount: number): this {
    this._params.reserveSlots = playerCount;
    return this;
  }

  attachToScreen(): this {
    if (this._turnOrderWidget) {
      this.destroy();
    }

    const turnOrder: TurnOrder = TI4.turnOrder;
    this._turnOrderWidget = new TurnOrderWidget(
      turnOrder,
      this._params
    ).attachToScreen();
    return this;
  }

  destroy(): void {
    if (this._turnOrderWidget) {
      this._turnOrderWidget.destroy();
      this._turnOrderWidget = undefined;
    }
    TI4.events.onPlayerChangedColor.remove(this._onPlayerChangedColorHandler);
  }
}
