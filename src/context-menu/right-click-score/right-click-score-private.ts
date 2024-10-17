import {
  Card,
  Player,
  SnapPoint,
  StaticObject,
} from "@tabletop-playground/api";
import { IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

import { AdvanceScore } from "../../lib/score-lib/advance-score/advance-score";
import { MoveCardToPlayerScored } from "../../lib/score-lib/move-card-to-player-scored/move-card-to-player-scored";
import { PlaceControlTokenOnCard } from "../../lib/control-token-lib/place-control-token-on-card";

/**
 * Score context menu item for cards that should move to
 * the player's scored area card-holer.
 */
export class RightClickScorePrivate implements IGlobal {
  private readonly _actionName: string = "*Score (private)";
  private readonly _prefixes: Array<string> = [
    "card.objective.secret",

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
    if (
      this._prefixes.some((prefix) => nsid.startsWith(prefix)) ||
      (nsid.startsWith("card.promissory") &&
        nsid.endsWith("support-for-the-throne"))
    ) {
      card.removeCustomAction(this._actionName);
      card.addCustomAction(this._actionName);
      card.onCustomAction.remove(this._customActionHandler);
      card.onCustomAction.add(this._customActionHandler);
    }
  }

  score(card: Card, player: Player): void {
    const playerSlot: number = player.getSlot();

    // Special case for "classified documents leaks" where a secret objective
    // becomes public.  If the secret is on the agenda/laws mat treat is as
    // public.
    let isPublic: boolean = false;
    const snappedToPoint: SnapPoint | undefined = card.getSnappedToPoint();
    if (snappedToPoint) {
      const snappedToObj: StaticObject | undefined =
        snappedToPoint.getParentObject();
      if (snappedToObj) {
        const nsid: string = NSID.get(snappedToObj);
        if (
          [
            "mat:base/objective-1",
            "mat:base/objective-2",
            "mat:base/agenda-laws",
          ].includes(nsid)
        ) {
          isPublic = true;
        }
      }
    }

    if (isPublic) {
      new PlaceControlTokenOnCard().place(card, playerSlot);
    } else {
      new MoveCardToPlayerScored().moveCard(card, playerSlot);
    }

    const value: number = 1;
    new AdvanceScore().addToScore(playerSlot, value);
  }
}
