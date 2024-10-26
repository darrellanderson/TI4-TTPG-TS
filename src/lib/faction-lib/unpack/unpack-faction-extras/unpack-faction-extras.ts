import { Container, GameObject, Vector } from "@tabletop-playground/api";
import { DeletedItemsContainer, Find, Spawn } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";

export class UnpackFactionExtras extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack() {
    const extrasContainer: Container = this._getFactionExtrasContainerOrThrow();

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
    const extrasContainer: Container = this._getFactionExtrasContainerOrThrow();
    const above: Vector = extrasContainer.getPosition().add([0, 0, 10]);
    const items: Array<GameObject> = extrasContainer.getItems();
    for (const item of items) {
      extrasContainer.take(item, above);
      DeletedItemsContainer.destroyWithoutCopying(item);
    }
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
}
