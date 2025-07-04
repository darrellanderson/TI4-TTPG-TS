import { Card, CardHolder } from "@tabletop-playground/api";
import { Find, Spawn } from "ttpg-darrell";

import { Faction } from "../../faction/faction";

export abstract class AbstractUnpack {
  private readonly _faction: Faction;
  private readonly _playerSlot: number;

  constructor(faction: Faction, playerSlot: number) {
    this._faction = faction;
    this._playerSlot = playerSlot;
  }

  getFaction(): Faction {
    return this._faction;
  }

  getPlayerSlot(): number {
    return this._playerSlot;
  }

  abstract unpack(): void;
  abstract remove(): void;

  spawnDeckAndFilterSourcesOrThrow(cardNsidPrefix: string): Card {
    // Get all decks using the card prefix.
    const deckNsids: Array<string> = Spawn.getAllNsids().filter(
      (nsid: string): boolean => {
        return nsid.startsWith(cardNsidPrefix);
      }
    );

    // Spawn decks, merge into one.
    if (deckNsids.length === 0) {
      throw new Error(`Missing deck: "${cardNsidPrefix}"`);
    }
    const deck: Card = Spawn.spawnMergeDecksOrThrow(deckNsids);

    // Remove any sources/nsids based on game config.
    TI4.removeRegistry.createRemoveFromRegistryAndConfig().removeOne(deck);

    return deck;
  }

  getPlayerHandHolderOrThrow(): CardHolder {
    const skipContained: boolean = true;
    const cardHolder: CardHolder | undefined = new Find().findCardHolder(
      "card-holder:base/player-hand",
      this.getPlayerSlot(),
      skipContained
    );
    if (!cardHolder) {
      throw new Error("Missing player hand holder");
    }
    return cardHolder;
  }

  dealToPlayerOrThrow(card: Card): void {
    const playerHandHolder: CardHolder = this.getPlayerHandHolderOrThrow();
    playerHandHolder.insert(card, playerHandHolder.getNumCards());
  }
}
