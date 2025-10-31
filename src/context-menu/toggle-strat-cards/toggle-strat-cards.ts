import { globalEvents, Player, world } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, PlayerSlot, Window } from "ttpg-darrell";
import {
  StrategyCardNumberAndState,
  StrategyCardsState,
} from "../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import {
  AbstractWindow,
  CreateAbstractUIParams,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { StrategyCardsUI } from "../../ui/strategy-card-ui/strategy-cards-ui/strategy-cards-ui";

/**
 * Most windows have a consistent size.  The strategy card window varies as
 * strategy cards are played and used, so we need a different window for each
 * player.
 */
type PerPlayerWindowData = {
  activeStrategyCardsKey: string;
  window: Window;
};

/**
 *  Manage window with active strategy cards.
 */
export class ToggleStratCards implements IGlobal {
  public static readonly TOGGLE_ACTION_NAME: string = "*Toggle Strat Cards";

  private readonly _strategyCardsState: StrategyCardsState;
  private readonly _playerSlotToWindowData = new Map<
    number,
    PerPlayerWindowData
  >();

  /**
   * Cannot use the normal "toggle window" handler because there's a
   * different window for each player.
   */
  private readonly _onCustomActionHandler = (
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ToggleStratCards.TOGGLE_ACTION_NAME) {
      const playerSlot: number = player.getSlot();
      const perPlayerWindowData: PerPlayerWindowData | undefined =
        this._playerSlotToWindowData.get(playerSlot);
      if (perPlayerWindowData) {
        this._closeWindow(playerSlot);
      } else {
        this._openWindow(playerSlot);
      }
    }
  };

  private readonly _onStrategyCardsStateChangedHandler = (): void => {
    // For each player:
    // - show window if active strategy cards.
    // - hide window if no active strategy cards.
    // - recreate window if active strategy cards changed.
    for (const playerSeat of TI4.playerSeats.getAllSeats()) {
      const playerSlot: number = playerSeat.playerSlot;
      const active: Array<StrategyCardNumberAndState> =
        this._strategyCardsState.active(playerSlot);
      const isActive: boolean = active.length > 0;
      const key: string = active.map((s) => s.number).join(",");

      const perPlayerWindowData: PerPlayerWindowData | undefined =
        this._playerSlotToWindowData.get(playerSlot);

      if (perPlayerWindowData && !isActive) {
        // Close window if no active strategy cards.
        this._closeWindow(playerSlot);
      } else if (!perPlayerWindowData && isActive) {
        // Create window if missing and active strategy cards.
        this._openWindow(playerSlot);
      } else if (
        perPlayerWindowData &&
        perPlayerWindowData.activeStrategyCardsKey !== key
      ) {
        // Recreate window if active strategy cards changed.
        this._updateWindow(playerSlot);
      }
    }
  };

  _closeWindow(playerSlot: number): void {
    const perPlayerWindowData: PerPlayerWindowData | undefined =
      this._playerSlotToWindowData.get(playerSlot);
    if (perPlayerWindowData) {
      perPlayerWindowData.window.destroy();
      this._playerSlotToWindowData.delete(playerSlot);
    }
  }

  _openWindow(playerSlot: number): void {
    let perPlayerWindowData: PerPlayerWindowData | undefined =
      this._playerSlotToWindowData.get(playerSlot);
    if (!perPlayerWindowData) {
      const window: Window = this._createWindow(playerSlot).attach();
      window.onAllClosed.add(() => {
        this._playerSlotToWindowData.delete(playerSlot);
      });
      const key: string = this._strategyCardsState
        .active(playerSlot)
        .map((s) => s.number)
        .join(",");
      perPlayerWindowData = {
        activeStrategyCardsKey: key,
        window,
      };
      this._playerSlotToWindowData.set(playerSlot, perPlayerWindowData);
    }
  }

  _updateWindow(playerSlot: number): void {
    const perPlayerWindowData: PerPlayerWindowData | undefined =
      this._playerSlotToWindowData.get(playerSlot);
    const key: string = this._strategyCardsState
      .active(playerSlot)
      .map((s) => s.number)
      .join(",");
    if (
      perPlayerWindowData &&
      perPlayerWindowData.activeStrategyCardsKey !== key
    ) {
      this._closeWindow(playerSlot);
      this._openWindow(playerSlot);
    }
  }

  constructor() {
    this._strategyCardsState = new StrategyCardsState("@strategy-cards/ti4");
  }

  init(): void {
    this._strategyCardsState.onStrategyCardsStateChanged.add(
      this._onStrategyCardsStateChangedHandler
    );
    globalEvents.onCustomAction.add(this._onCustomActionHandler);
    world.addCustomAction(
      ToggleStratCards.TOGGLE_ACTION_NAME,
      TI4.locale("tooltip.toggle-strat-cards")
    );
  }

  getStrategyCardsState(): StrategyCardsState {
    return this._strategyCardsState;
  }

  _createWindow(playerSlot: PlayerSlot): Window {
    const createAbstractUI = (params: CreateAbstractUIParams): AbstractUI => {
      return new StrategyCardsUI(
        params.scale,
        this._strategyCardsState,
        playerSlot
      );
    };
    const namespaceId: NamespaceId | undefined =
      `@window/strat-cards-${playerSlot}`;
    const windowTitle: string = "Strat Cards";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );

    const playerSlots: Array<number> = [playerSlot];
    return abstractWindow.createWindow(playerSlots);
  }
}
