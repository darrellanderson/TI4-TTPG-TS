import { Card, Player } from "@tabletop-playground/api";
import { Find, IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

import { AdvanceScore } from "../../lib/score-lib/advance-score/advance-score";
import { MoveCardToPlayerScored } from "../../lib/score-lib/move-card-to-player-scored/move-card-to-player-scored";
import { Scoreboard } from "../../lib/score-lib/scoreboard/scoreboard";

export class RightClickScore implements IGlobal {
  private readonly _find: Find = new Find();
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  private readonly _actionName: string = "*Score";
  private readonly _prefixes: Array<string> = [
    "card.objective.secret",
    "card.objective.public-1",
    "card.objective.public-2",

    // Can also give full NSIDs.
    "card.action:base/imperial-rider",
    "card.agenda:base/holy-planet-of-ixth",
    "card.agenda:base/shard-of-the-throne",
    "card.agenda:base/the-crown-of-emphidia",
    "card.agenda:pok/political-censure",
    "card.relic:pok/shard-of-the-throne",
    "card.relic:pok/the-crown-of-emphidia",
  ];

  private readonly _customActionHandler = (
    card: Card,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName) {
      this.score(card, player);
    }
  };

  init(): void {
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card: Card) => {
      card.removeCustomAction(this._actionName);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card: Card) => {
      this._maybeAddContextMenuItem(card);
    });
  }

  _maybeAddContextMenuItem(card: Card): void {
    const nsid: string = NSID.get(card);
    if (this._prefixes.some((prefix) => nsid.startsWith(prefix))) {
      card.removeCustomAction(this._actionName);
      card.addCustomAction(this._actionName);
      card.onCustomAction.remove(this._customActionHandler);
      card.onCustomAction.add(this._customActionHandler);
    }
  }

  score(card: Card, player: Player): void {
    const playerSlot: number = player.getSlot();

    new MoveCardToPlayerScored().moveCard(card, playerSlot);

    const nsid: string = NSID.get(card);
    const value: number = nsid.startsWith("card.objective.public-2") ? 2 : 1;
    new AdvanceScore().addToScore(playerSlot, value);
  }
}
