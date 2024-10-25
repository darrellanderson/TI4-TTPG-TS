import { Card, Vector, world } from "@tabletop-playground/api";
import {
  CardUtil,
  DeletedItemsContainer,
  Find,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";

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
    const nsidNames: Array<string> = this._getNsidNames();
    const alliances: Card | undefined = new CardUtil().filterCards(
      unfilteredAlliancesDeck,
      (nsid: string): boolean => {
        for (const nsidName of nsidNames) {
          if (nsid.includes(nsidName)) {
            return true;
          }
        }
        return false;
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
    const nsidNames: Array<string> = this._getNsidNames();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("card.alliance:")) {
        const pos: Vector = obj.getPosition();
        const owner: number = this._find.closestOwnedCardHolderOwner(pos);
        if (owner === this.getPlayerSlot()) {
          for (const nsidName of nsidNames) {
            if (nsid.includes(nsidName)) {
              DeletedItemsContainer.destroyWithoutCopying(obj);
            }
          }
        }
      }
    }
  }

  _getNsidNames(): Array<string> {
    // Careful, there may be an omega version of the alliance card!
    // Unlike most faction methods it does not add omega versions with
    // corrected sources; just use the name part of the nsid to match.
    const nsid: string = this.getFaction().getAllianceNsid();
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    const nsidNames: Array<string> = [];
    if (parsed) {
      // Include leading slash to match the start of a name.
      const nsidName = "/" + parsed.nameParts.join(".");
      nsidNames.push(nsidName);
      nsidNames.push(nsidName + ".omega");
    }
    return nsidNames;
  }
}
