import { GameObject, Player } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, Window } from "ttpg-darrell";
import { StrategyCardsState } from "../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import {
  AbstractWindow,
  CreateAbstractUIParams,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { StrategyCardsUI } from "../../ui/strategy-card-ui/strategy-cards-ui/strategy-cards-ui";

/**
 *  Manage window with active strategy cards.
 */
export class ToggleStratCards implements IGlobal {
  private readonly _strategyCardsState: StrategyCardsState;
  private _strategyCardsWindow: Window | undefined = undefined;

  private readonly _onStrategyCardPlayedHandler = (
    _strategyCard: GameObject,
    _player: Player
  ): void => {
    // Show UI to all players.
    const window: Window | undefined = this._strategyCardsWindow;
    if (window) {
      for (const playerSeat of TI4.playerSeats.getAllSeats()) {
        const playerSlot: number = playerSeat.playerSlot;
        // Hide if currently visible.
        if (window.isAttachedForPlayer(playerSlot)) {
          window.toggleForPlayer(playerSlot);
        }
        // (re)create with the new contents.
        window.toggleForPlayer(playerSlot);
      }
    }
  };

  constructor() {
    this._strategyCardsState = new StrategyCardsState("@strategy-cards/ti4");
  }

  init(): void {
    TI4.events.onStrategyCardPlayed.add(this._onStrategyCardPlayedHandler);
    this._strategyCardsWindow = this._createWindow();
  }

  _createWindow(): Window {
    const createAbstractUI = (params: CreateAbstractUIParams): AbstractUI => {
      return new StrategyCardsUI(
        params.scale,
        this._strategyCardsState,
        params.playerSlot
      );
    };
    const namespaceId: NamespaceId | undefined = "@window/strategy-cards";
    const windowTitle: string = "Strat Cards";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;

    const playerSlots: Array<number> = TI4.playerSeats
      .getAllSeats()
      .map((playerSeat) => playerSeat.playerSlot);
    return abstractWindow.createWindow(playerSlots);
  }
}
