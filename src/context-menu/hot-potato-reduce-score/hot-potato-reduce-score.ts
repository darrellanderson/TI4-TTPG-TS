import {
  Card,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

const HOT_POTATO_NSIDS: Set<string> = new Set<string>([]);

export class HotPotatoReduceScore implements IGlobal {
  private readonly _actionName: string = "*Score";
  private readonly _customActionHandler = (
    obj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName && obj instanceof Card) {
      this._maybeUnscore(obj, player);
    }
  };

  init(): void {
    for (const obj of world.getAllObjects()) {
      this._maybeAddContextMenuItem(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAddContextMenuItem(obj);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card: Card) => {
      this._maybeAddContextMenuItem(card);
    });
  }

  _maybeAddContextMenuItem(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (HOT_POTATO_NSIDS.has(nsid)) {
      obj.removeCustomAction(this._actionName);
      obj.addCustomAction(this._actionName);
      obj.onCustomAction.remove(this._customActionHandler);
      obj.onCustomAction.add(this._customActionHandler);
    }
  }

  _maybeUnscore(card: Card, player: Player): void {}

  _addScoredBy(nsid: string : playserSlot)
}
