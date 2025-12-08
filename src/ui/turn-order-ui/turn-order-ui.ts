import {
  TurnEntryWart,
  TurnEntryWidget,
  TurnOrder,
  TurnOrderWidget,
  TurnOrderWidgetParams,
} from "ttpg-darrell";
import { TurnOrderEntry } from "./turn-order-entry";
import { Player } from "@tabletop-playground/api";

const CUSTOM_ACTION_CHANGE_COLOR: string = "Change color";

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
        name: CUSTOM_ACTION_CHANGE_COLOR,
      },
    ],
    onCustomAction: (
      clickingPlayer: Player,
      identifier: string,
      targetPlayerSlot: number
    ) => {
      if (identifier === CUSTOM_ACTION_CHANGE_COLOR) {
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

  private _onTurnStateChanged = () => {
    const order: Array<number> = TI4.turnOrder.getTurnOrder();
    if (order.length !== TI4.config.playerCount) {
      this.attachToScreen();
    }
  };

  constructor() {
    TurnOrder.onTurnStateChanged.add(this._onTurnStateChanged);
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
      this._turnOrderWidget.detach();
      this._turnOrderWidget.destroy();
      this._turnOrderWidget = undefined;
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
      this._turnOrderWidget.detach();
      this._turnOrderWidget.destroy();
      this._turnOrderWidget = undefined;
    }
    TurnOrder.onTurnStateChanged.remove(this._onTurnStateChanged);
    TI4.events.onPlayerChangedColor.remove(this._onPlayerChangedColorHandler);
  }
}
