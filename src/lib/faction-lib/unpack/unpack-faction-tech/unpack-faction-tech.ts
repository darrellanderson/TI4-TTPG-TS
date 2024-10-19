import { Card } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { CardUtil, DeletedItemsContainer, Find, Spawn } from "ttpg-darrell";

export class UnpackFactionTech extends AbstractUnpack {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    // Find existing per-player faction tech deck.
    const existingTechDeck: Card | undefined = this._find.findDeckOrDiscard(
      "deck-technology",
      undefined,
      undefined,
      this.getPlayerSlot()
    );
    if (!existingTechDeck) {
      throw new Error(`Could not find tech deck for ${this.getPlayerSlot()}`);
    }

    // Generate full tech deck.
    const nsids: Array<string> = Spawn.getAllNsids().filter((nsid: string) =>
      nsid.startsWith("card.technology")
    );
    const deck: Card = Spawn.spawnMergeDecksOrThrow(nsids);

    // Extract faction tech cards.
    const filtered: Card | undefined = this._filterFactionTech(deck);
    DeletedItemsContainer.destroyWithoutCopying(deck);

    if (filtered) {
      existingTechDeck.addCards(filtered);
    }
  }

  remove(): void {
    // Find existing per-player faction tech deck.
    const existingTechDeck: Card | undefined = this._find.findDeckOrDiscard(
      "deck-technology",
      undefined,
      undefined,
      this.getPlayerSlot()
    );
    if (!existingTechDeck) {
      throw new Error(`Could not find tech deck for ${this.getPlayerSlot()}`);
    }

    const filtered: Card | undefined =
      this._filterFactionTech(existingTechDeck);

    if (filtered) {
      DeletedItemsContainer.destroyWithoutCopying(filtered);
    }
  }

  _filterFactionTech(deck: Card): Card | undefined {
    const factionTechNsidNames: Array<string> =
      this.getFaction().getFactionTechNsidNames();

    return this._cardUtil.filterCards(deck, (nsid: string): boolean => {
      for (const factionTechNsidName of factionTechNsidNames) {
        if (nsid.endsWith(factionTechNsidName)) {
          return true;
        }
      }
      return false;
    });
  }
}
