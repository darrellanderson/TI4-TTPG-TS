import { Card, Player } from "@tabletop-playground/api";
import { NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

import { AdvanceScore } from "../../lib/score-lib/advance-score/advance-score";
import { PlaceControlTokenOnCard } from "../../lib/control-token-lib/place-control-token-on-card";

/**
 * Score context menu for cards that receive control tokens;
 * they do NOT move the player's scored area card-holder.
 */
export class RightClickScorePublic {
  private readonly _actionName: string = "*Score (public)";
  private readonly _prefixes: Array<string> = [
    "card.objective.public-1",
    "card.objective.public-2",

    // Can also give full NSIDs.
    "card.agenda:base/mutiny",
    "card.agenda:base/seed-of-an-empire",
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

    new PlaceControlTokenOnCard().place(card, playerSlot);

    const nsid: string = NSID.get(card);
    const value: number = nsid.startsWith("card.objective.public-2") ? 2 : 1;
    new AdvanceScore().addToScore(playerSlot, value);
  }
}
