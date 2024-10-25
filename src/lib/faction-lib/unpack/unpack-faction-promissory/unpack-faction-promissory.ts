import { Card, Vector, world } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { CardUtil, DeletedItemsContainer, Find, NSID } from "ttpg-darrell";

export class UnpackFactionPromissory extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const deck: Card =
      this.spawnDeckAndFilterSourcesOrThrow("card.promissory:");
    this._dealPromissoryCardsAndDeleteDeck(deck);
  }

  _dealPromissoryCardsAndDeleteDeck(unfilteredPromissoryDeck: Card) {
    const nsids: Set<string> = new Set<string>(
      this.getFaction().getPromissoryNsids()
    );
    const promissories: Card | undefined = new CardUtil().filterCards(
      unfilteredPromissoryDeck,
      (nsid: string): boolean => {
        return nsids.has(nsid);
      }
    );
    if (!promissories) {
      throw new Error("Missing promissory cards");
    }

    const cards: Array<Card> = new CardUtil().separateDeck(promissories);
    for (const card of cards) {
      card.setRotation([0, 0, 180]);
      this.dealToPlayerOrThrow(card);
    }

    DeletedItemsContainer.destroyWithoutCopying(unfilteredPromissoryDeck);
  }

  remove(): void {
    const nsids: Set<string> = new Set<string>(
      this.getFaction().getPromissoryNsids()
    );
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.has(nsid)) {
        const pos: Vector = obj.getPosition();
        const owner: number = this._find.closestOwnedCardHolderOwner(pos);
        if (owner === this.getPlayerSlot()) {
          DeletedItemsContainer.destroyWithoutCopying(obj);
        }
      }
    }
  }
}
