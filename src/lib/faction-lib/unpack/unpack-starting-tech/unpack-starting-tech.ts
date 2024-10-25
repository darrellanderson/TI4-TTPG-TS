import {
  Card,
  CardHolder,
  GameObject,
  SnapPoint,
} from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

export class UnpackStartingTech extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const startingTechNsidNames: Array<string> =
      this.getFaction().getStartingTechNsidNames();
    if (startingTechNsidNames.length === 0) {
      return;
    }

    const techDeck: Card = this._getTechDeckOrThrow();
    const mine: Card | undefined = this._cardUtil.filterCards(
      techDeck,
      (nsid: string): boolean => {
        for (const startingTechNsidName of startingTechNsidNames) {
          const omega: string = startingTechNsidName + ".omega";
          if (nsid.endsWith(startingTechNsidName) || nsid.endsWith(omega)) {
            return true;
          }
        }
        return false;
      }
    );
    if (!mine) {
      throw new Error(
        `Missing starting tech cards (${startingTechNsidNames.join(", ")})`
      );
    }
    const cards: Array<Card> = this._cardUtil.separateDeck(mine);
    for (const card of cards) {
      this.dealToPlayerOrThrow(card);
    }
  }

  remove(): void {
    const startingTechNsidNames: Array<string> =
      this.getFaction().getStartingTechNsidNames();
    if (startingTechNsidNames.length === 0) {
      return;
    }
    const playerHand: CardHolder = this.getPlayerHandHolderOrThrow();
    const techDeck: Card = this._getTechDeckOrThrow();

    for (const card of playerHand.getCards()) {
      const nsid: string = NSID.get(card);
      for (const startingTechNsidName of startingTechNsidNames) {
        if (nsid.endsWith(startingTechNsidName)) {
          card.removeFromHolder();
          techDeck.addCards(card);
        }
      }
    }
  }

  _getTechDeckOrThrow(): Card {
    const snapPoint: SnapPoint | undefined = this._find.findSnapPointByTag(
      "deck-technology",
      this.getPlayerSlot()
    );
    if (!snapPoint) {
      throw new Error("Missing tech deck (no snap point)");
    }
    const snapped: GameObject | undefined = snapPoint.getSnappedObject();
    if (!snapped) {
      throw new Error("Missing tech deck (no snapped object)");
    }
    if (!(snapped instanceof Card)) {
      throw new Error("Missing tech deck (not a card)");
    }
    return snapped;
  }
}
