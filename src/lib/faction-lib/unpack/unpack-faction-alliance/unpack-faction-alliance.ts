import { Card, world } from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, NSID, Spawn } from "ttpg-darrell";

import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";

export class UnpackFactionAlliance extends AbstractUnpack {
  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const deckNsids: Array<string> = Spawn.getAllNsids().filter(
      (nsid: string): boolean => {
        return nsid.startsWith("card.alliance:");
      }
    );
    const deck: Card = Spawn.spawnMergeDecksOrThrow(deckNsids);
    this._dealAllianceCardsAndDeleteDeck(deck);
  }

  _dealAllianceCardsAndDeleteDeck(unfilteredAlliancesDeck: Card) {
    const nsids: Set<string> = this._getNsids();
    const alliances: Card | undefined = new CardUtil().filterCards(
      unfilteredAlliancesDeck,
      (nsid: string): boolean => {
        return nsids.has(nsid);
      }
    );
    if (!alliances) {
      throw new Error("Missing alliance cards");
    }

    const cards: Array<Card> = new CardUtil().separateDeck(alliances);
    for (const card of cards) {
      this.dealToPlayerOrThrow(card);
    }

    DeletedItemsContainer.destroyWithoutCopying(unfilteredAlliancesDeck);
  }

  remove(): void {
    const nsids: Set<string> = this._getNsids();

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.has(nsid)) {
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
  }

  _getNsids(): Set<string> {
    // Careful, there may be an omega version of the alliance card!
    const nsid: string = this.getFaction().getAllianceNsid();
    const nsids: Set<string> = new Set<string>();
    nsids.add(nsid);
    nsids.add(nsid + ".omega");
    return nsids;
  }
}
