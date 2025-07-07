import {
  Color,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { Broadcast, Facing, IGlobal, NSID } from "ttpg-darrell";

/**
 * Adds a custom action to strategy cards, and triggers an event when played.
 */
export class OnStrategyCardPlayed implements IGlobal {
  public static readonly ACTION_NAME: string = "*Play Strategy Card";

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === OnStrategyCardPlayed.ACTION_NAME) {
      // Flip if not already flipped.
      if (Facing.isFaceUp(object)) {
        object.flipOrUpright();
      }

      // Report.
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `${playerName} played ${object.getName()}`;
      const color: Color = world.getSlotColor(player.getSlot());
      Broadcast.broadcastAll(msg, color);

      // Tell listeners.
      TI4.events.onStrategyCardPlayed.trigger(object, player);
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
}
