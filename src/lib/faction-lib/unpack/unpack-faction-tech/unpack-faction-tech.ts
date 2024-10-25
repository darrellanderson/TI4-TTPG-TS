import { Card } from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Find } from "ttpg-darrell";

import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";

export class UnpackFactionTech extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const deck: Card = this.spawnDeckAndFilterSourcesOrThrow("card.technology");
    const filtered: Card | undefined = this._filterFactionTech(deck);
    DeletedItemsContainer.destroyWithoutCopying(deck);
    this._addFilteredToExistingTechDeck(filtered);
  }

  remove(): void {
    const existingTechDeck: Card = this._getExistingTechDeckOrThrow();

    const filtered: Card | undefined =
      this._filterFactionTech(existingTechDeck);

    if (filtered) {
      DeletedItemsContainer.destroyWithoutCopying(filtered);
    }
  }

  _getExistingTechDeckOrThrow(): Card {
    const existingTechDeck: Card | undefined = this._find.findDeckOrDiscard(
      "deck-technology",
      undefined,
      undefined,
      this.getPlayerSlot()
    );
    if (!existingTechDeck) {
      throw new Error(`Could not find tech deck for ${this.getPlayerSlot()}`);
    }
    return existingTechDeck;
  }

  _filterFactionTech(deck: Card): Card | undefined {
    const factionTechNsids: Set<string> = new Set<string>(
      this.getFaction().getFactionTechNsids()
    );

    return this._cardUtil.filterCards(deck, (nsid: string): boolean => {
      return factionTechNsids.has(nsid);
    });
  }

  _addFilteredToExistingTechDeck(filtered: Card | undefined): void {
    const existingTechDeck: Card = this._getExistingTechDeckOrThrow();
    if (filtered) {
      existingTechDeck.addCards(filtered);
    }
  }
}
