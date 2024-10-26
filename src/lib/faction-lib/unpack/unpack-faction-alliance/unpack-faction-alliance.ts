import { Card, Vector, world } from "@tabletop-playground/api";
import { CardUtil, DeletedItemsContainer, Find, NSID } from "ttpg-darrell";

import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";

export class UnpackFactionAlliance extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const deck: Card = this.spawnDeckAndFilterSourcesOrThrow("card.alliance:");
    this._dealAllianceCardsAndDeleteDeck(deck);
  }

  _dealAllianceCardsAndDeleteDeck(unfilteredAlliancesDeck: Card) {
    const nsids: Set<string> = new Set<string>(
      this.getFaction().getAllianceNsids()
    );
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
      card.setRotation([0, 0, 180]);
      this.dealToPlayerOrThrow(card);
    }

    DeletedItemsContainer.destroyWithoutCopying(unfilteredAlliancesDeck);
  }

  remove(): void {
    const nsids: Set<string> = new Set<string>(
      this.getFaction().getAllianceNsids()
    );
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.has(nsid)) {
        const pos: Vector = obj.getPosition();
        const owner: number = this._find.closestOwnedCardHolderOwner(pos);
        if (owner === this.getPlayerSlot()) {
          if (obj instanceof Card) {
            obj.removeFromHolder();
          }
          DeletedItemsContainer.destroyWithoutCopying(obj);
        }
      }
    }
  }
}
