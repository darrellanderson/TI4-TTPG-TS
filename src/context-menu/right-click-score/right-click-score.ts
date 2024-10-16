import {
  Card,
  CardHolder,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Find, IGlobal, NSID, OnCardBecameSingletonOrDeck } from "ttpg-darrell";

import { Scoreboard } from "../../lib/score-lib/scoreboard/scoreboard";

export class RightClickScore implements IGlobal {
  private readonly _find: Find = new Find();
  private readonly _scoreboard: Scoreboard = new Scoreboard();

  private readonly _actionName: string = "*Score";
  private readonly _prefixes: Array<string> = [
    "card.objective.secret",
    "card.objective.public-1",
    "card.objective.public-2",
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
      console.log("onSingletonCardMadeDeck");
      card.removeCustomAction(this._actionName);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card: Card) => {
      console.log("onSingletonCardCreated");
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
    this._moveToScoringHolder(card, playerSlot);
    this._advanceScoreboard(playerSlot);
  }

  _moveToScoringHolder(card: Card, playerSlot: number): void {
    const nsid: string = "card-holder:base/player-scoring";
    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = this._find.findCardHolder(
      nsid,
      playerSlot,
      skipContained
    );
    if (cardHolder) {
      if (card.isHeld()) {
        card.release();
      }
      if (card.isInHolder()) {
        card.removeFromHolder();
      }
      const index: number = cardHolder.getCards().length;
      cardHolder.insert(card, index);
    }
  }

  _advanceScoreboard(playerSlot: number): void {
    const token: GameObject | undefined =
      this._scoreboard.getLeadControlToken(playerSlot);
    if (token) {
      const pos: Vector = token.getPosition();
      const score: number | undefined = this._scoreboard.posToScore(pos);
      if (score !== undefined) {
        const dst: Vector | undefined = this._scoreboard.scoreToPos(
          score + 1,
          playerSlot
        );
        if (dst) {
          dst.z = world.getTableHeight() + 10;
          token.setPosition(dst, 1);
          token.snapToGround();
        }
      }
    }
  }
}
