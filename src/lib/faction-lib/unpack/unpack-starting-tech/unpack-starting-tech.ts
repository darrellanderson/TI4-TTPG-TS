import { Card, CardHolder } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { FindPlayerTechDeck } from "../../../tech-lib/find-player-tech-deck/find-player-tech-deck";

export class UnpackStartingTech extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const startingTechNsids: Set<string> = new Set<string>(
      this.getFaction().getStartingTechNsids()
    );
    if (startingTechNsids.size === 0) {
      return;
    }

    const techDeck: Card = this._getTechDeckOrThrow();
    const mine: Card | undefined = this._cardUtil.filterCards(
      techDeck,
      (nsid: string): boolean => {
        return startingTechNsids.has(nsid);
      }
    );
    if (!mine) {
      throw new Error(
        `Missing starting tech cards (${Array.from(startingTechNsids).join(", ")})`
      );
    }
    const cards: Array<Card> = this._cardUtil.separateDeck(mine);
    for (const card of cards) {
      card.setRotation([0, 0, 180]);
      this.dealToPlayerOrThrow(card);
    }
  }

  remove(): void {
    const startingTechNsids: Set<string> = new Set<string>(
      this.getFaction().getStartingTechNsids()
    );
    const playerHand: CardHolder = this.getPlayerHandHolderOrThrow();
    const techDeck: Card = this._getTechDeckOrThrow();

    for (const card of playerHand.getCards()) {
      const nsid: string = NSID.get(card);
      if (startingTechNsids.has(nsid)) {
        card.removeFromHolder();
        techDeck.addCards(card);
      }
    }
  }

  _getTechDeckOrThrow(): Card {
    return new FindPlayerTechDeck().getTechDeckOrThrow(this.getPlayerSlot());
  }
}
