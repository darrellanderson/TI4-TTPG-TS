import { Container, GameObject } from "@tabletop-playground/api";
import { DeletedItemsContainer, Find, Spawn } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

export class UnpackFactionExtras extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack() {
    const extrasContainer: Container = Spawn.spawnOrThrow(
      "container:base/faction-extras"
    ) as Container;
    extrasContainer.setOwningPlayerSlot(this.getPlayerSlot());

    const faction: Faction = this.getFaction();
    const nsids: Array<string> = faction.getExtras();
    for (const nsid of nsids) {
      const count: number = faction.getExtraCount(nsid);
      for (let i = 0; i < count; i++) {
        const obj: GameObject = Spawn.spawnOrThrow(nsid);
        extrasContainer.insert([obj]);
      }
    }
  }

  remove() {
    const skipContained: boolean = true;
    const extrasContainer: Container | undefined = this._find.findContainer(
      "container:base/faction-extras",
      this.getPlayerSlot(),
      skipContained
    );

    if (extrasContainer) {
      const items: Array<GameObject> = extrasContainer.getItems();
      for (const item of items) {
        DeletedItemsContainer.destroyWithoutCopying(item);
      }
      DeletedItemsContainer.destroyWithoutCopying(extrasContainer);
    }
  }
}
