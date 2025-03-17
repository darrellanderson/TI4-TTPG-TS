import { Container, GameObject, ObjectType } from "@tabletop-playground/api";
import { SystemSchemaType } from "lib/system-lib/schema/system-schema";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutSystemContainer {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const systemTiles: Array<GameObject> = [];
    const tag: string = "system";
    let tags: Array<string>;

    const tileNumbers: Array<number> =
      TI4.systemRegistry.getAllSystemTileNumbers();
    for (const tileNumber of tileNumbers) {
      const systemSchema: SystemSchemaType | undefined =
        TI4.systemRegistry.rawBySystemTileNumber(tileNumber);
      const nsid: string | undefined =
        TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
      if (systemSchema && !systemSchema.isHome && nsid) {
        const systemTile: GameObject = Spawn.spawnOrThrow(nsid);
        systemTiles.push(systemTile);

        tags = systemTile.getTags();
        if (!tags.includes(tag)) {
          tags.push(tag);
          systemTile.setTags(tags);
        }
      }
    }

    const container: GameObject = Spawn.spawnOrThrow("container:base/systems");
    if (container instanceof Container) {
      container.setMaxItems(500);
      container.insert(systemTiles);

      // Apply tag to restrict what can enter.
      tags = container.getContainerTags();
      if (!tags.includes(tag)) {
        tags.push(tag);
        container.setContainerTags(tags);
      }
    }

    this._layout.add(container).addAfterLayout(() => {
      container.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
