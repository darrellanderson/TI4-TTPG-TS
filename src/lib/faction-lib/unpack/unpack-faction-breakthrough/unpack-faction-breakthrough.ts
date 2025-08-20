import { Card, Container, Vector, world } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { CardUtil, DeletedItemsContainer, Find, NSID } from "ttpg-darrell";

export class UnpackFactionBreakthrough extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    if (TI4.config.sources.includes("thunders-edge")) {
      const deck: Card =
        this.spawnDeckAndFilterSourcesOrThrow("card.breakthrough:");
      this._dealBreakthroughCardsAndDeleteDeck(deck);
    }
  }

  _dealBreakthroughCardsAndDeleteDeck(unfilteredBreakthroughDeck: Card) {
    const nsids: Set<string> = new Set<string>(
      this.getFaction().getBreakthroughNsids()
    );
    const breakthroughs: Card | undefined = new CardUtil().filterCards(
      unfilteredBreakthroughDeck,
      (nsid: string): boolean => {
        return nsids.has(nsid);
      }
    );
    if (!breakthroughs) {
      throw new Error(
        "Missing breakthrough cards: " + Array.from(nsids).join(", ")
      );
    }

    const cards: Array<Card> = new CardUtil().separateDeck(breakthroughs);
    const extrasContainer: Container = this._getFactionExtrasContainerOrThrow();
    extrasContainer.insert(cards);

    DeletedItemsContainer.destroyWithoutCopying(unfilteredBreakthroughDeck);
  }

  _getFactionExtrasContainerOrThrow(): Container {
    const skipContained: boolean = true;
    const extrasContainer: Container | undefined = this._find.findContainer(
      "container:base/faction-extras",
      this.getPlayerSlot(),
      skipContained
    );
    if (!extrasContainer) {
      throw new Error("Faction extras container not found");
    }
    return extrasContainer;
  }

  remove(): void {
    const nsids: Set<string> = new Set<string>(
      this.getFaction().getBreakthroughNsids()
    );
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsids.has(nsid)) {
        const container: Container | undefined = obj.getContainer();
        let pos: Vector;
        if (container) {
          pos = container.getPosition();
        } else {
          pos = obj.getPosition();
        }
        const owner: number = this._find.closestOwnedCardHolderOwner(pos);
        if (owner === this.getPlayerSlot()) {
          if (obj instanceof Card) {
            obj.removeFromHolder();
          }
          if (container) {
            container.remove(obj);
          }
          DeletedItemsContainer.destroyWithoutCopying(obj);
        }
      }
    }
  }
}
