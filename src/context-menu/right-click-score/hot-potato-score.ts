import {
  Card,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
} from "ttpg-darrell";
import { MoveCardToPlayerScored } from "../../lib/score-lib/move-card-to-player-scored/move-card-to-player-scored";
import { AdvanceScore } from "../../lib/score-lib/advance-score/advance-score";

const HOT_POTATO_NSIDS: Set<string> = new Set<string>([
  "card.relic:pok/shard-of-the-throne",
  "card.legendary-planet:thunders-edge/a-song-like-marrow",
]);

/**
 * Hot potato cards score for a player, remove a score from the previous player.
 */
export class RightClickHotPotatoScore implements IGlobal {
  private readonly _actionName: string = "*Score";
  private readonly _dataKey: string = "_prevScoreSlot";

  private readonly _customActionHandler = (
    obj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName && obj instanceof Card) {
      this._maybeUnscore(obj);
      this._score(obj, player.getSlot());
    }
  };

  init(): void {
    for (const obj of world.getAllObjects()) {
      this._maybeAddContextMenuItem(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAddContextMenuItem(obj);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card: Card) => {
      this._maybeAddContextMenuItem(card);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card: Card) => {
      card.removeCustomAction(this._actionName);
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

  _maybeUnscore(card: Card): void {
    const prevScoreStr: string = card.getSavedData(this._dataKey);
    if (prevScoreStr && prevScoreStr !== "") {
      const prevScoreSlot: number = parseInt(prevScoreStr, 10);
      new AdvanceScore().addToScore(prevScoreSlot, -1);

      const playerName: string = TI4.playerName.getBySlot(prevScoreSlot);
      Broadcast.chatAll(`${playerName} loses 1 point`);
    }
  }

  _score(card: Card, playerSlot: number): void {
    new MoveCardToPlayerScored().moveCard(card, playerSlot);

    const value: number = 1;
    new AdvanceScore().addToScore(playerSlot, value);

    card.setSavedData(playerSlot.toString(), this._dataKey);

    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    Broadcast.chatAll(`${playerName} gains 1 point`);
  }
}
