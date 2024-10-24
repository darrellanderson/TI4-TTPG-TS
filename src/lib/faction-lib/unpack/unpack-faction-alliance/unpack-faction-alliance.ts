import { Card } from "@tabletop-playground/api";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { CardUtil, DeletedItemsContainer, Spawn } from "ttpg-darrell";
import { GameObject } from "ttpg-mock";

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

    const nsids: Set<string> = this._getNsids();
    const alliances: Card | undefined = new CardUtil().filterCards(
      deck,
      (nsid: string): boolean => {
        return nsids.has(nsid);
      }
    );

    DeletedItemsContainer.destroyWithoutCopying(deck);
  }

  remove(): void {
    const nsids: Set<string> = this._getNsids();
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
