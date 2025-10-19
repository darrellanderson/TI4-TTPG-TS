import { Container, GameObject } from "@tabletop-playground/api";
import { Find, GarbageHandler, NSID } from "ttpg-darrell";
import { Faction } from "../../../faction-lib/faction/faction";

export class RecycleFactionExtra extends GarbageHandler {
  private readonly _find: Find = new Find();
  private readonly _nsidToFaction: Set<string> = new Set();

  canRecycle(obj: GameObject): boolean {
    if (this._nsidToFaction.size === 0) {
      TI4.factionRegistry.getAllFactions().forEach((faction: Faction): void => {
        faction.getExtras().forEach((nsid: string): void => {
          this._nsidToFaction.add(nsid);
        });
      });
    }

    const nsid: string = NSID.get(obj);
    return this._nsidToFaction.has(nsid);
  }

  recycle(obj: GameObject): boolean {
    const owner: number = obj.getOwningPlayerSlot();

    const containerNsid: string = `container:base/faction-extras`;
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      containerNsid,
      owner,
      skipContained
    );

    if (container) {
      container.addObjects([obj]);
      return obj.getContainer() === container; // might be full
    }

    return false;
  }
}
