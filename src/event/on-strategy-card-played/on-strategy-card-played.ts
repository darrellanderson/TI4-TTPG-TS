import {
  Color,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { Broadcast, IGlobal, NamespaceId, NSID, Window } from "ttpg-darrell";
import { StrategyCardsState } from "../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import {
  AbstractWindow,
  CreateAbstractUIParams,
} from "../../ui/abstract-window/abstract-window";
import { CardLeadershipUI } from "../../ui/strategy-card-ui/card-leadership-ui/card-leadership-ui";

export class OnStrategyCardPlayed implements IGlobal {
  public static readonly ACTION_NAME: string = "*Play Strategy Card";
  public readonly _strategyCardsState: StrategyCardsState =
    new StrategyCardsState("@strategy-cards/ti4");
  private _strategyCardsWindow: Window | undefined = undefined;

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === OnStrategyCardPlayed.ACTION_NAME) {
      // Report.
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `${playerName} played ${object.getName()}`;
      const color: Color = world.getSlotColor(player.getSlot());
      Broadcast.broadcastAll(msg, color);

      // Tell listeners.
      TI4.events.onStrategyCardPlayed.trigger(object, player);

      // Show UI.
      if (this._strategyCardsWindow) {
        for (const playerSeat of TI4.playerSeats.getAllSeats()) {
          const playerSlot: number = playerSeat.playerSlot;
          // Hide if currently visible.
          if (this._strategyCardsWindow.isAttachedForPlayer(playerSlot)) {
            this._strategyCardsWindow.toggleForPlayer(playerSlot);
          }
          // (re)create with the new contents.
          this._strategyCardsWindow.toggleForPlayer(playerSlot);
        }
      }

      if (this._strategyCardsWindow !== undefined) {
        this._strategyCardsWindow.attach();
      }
    }
  };

  init() {
    globalEvents.onObjectCreated.add((obj: GameObject): void => {
      this._maybeAdd(obj);
    });
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAdd(obj);
    }
    this.createStrategyCardWindow(); // empty contents
  }

  _maybeAdd(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.strategy-card:")) {
      obj.removeCustomAction(OnStrategyCardPlayed.ACTION_NAME);
      obj.addCustomAction(OnStrategyCardPlayed.ACTION_NAME);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  }

  createStrategyCardWindow(): void {
    if (this._strategyCardsWindow !== undefined) {
      this._strategyCardsWindow.destroy();
      this._strategyCardsWindow = undefined;
    }

    const createAbstractUI = (params: CreateAbstractUIParams) => {
      return new CardLeadershipUI(params.scale, true);
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
    this._strategyCardsWindow = abstractWindow.createWindow(playerSlots);
  }
}
