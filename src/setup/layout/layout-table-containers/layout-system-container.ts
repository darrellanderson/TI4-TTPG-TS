import { Container, GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
import { SystemSchemaType } from "../../../lib/system-lib/schema/system-schema";

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
        const systemTile: GameObject | undefined = TI4.spawn.spawn(nsid);
        if (systemTile) {
          systemTiles.push(systemTile);

          tags = systemTile.getTags();
          if (!tags.includes(tag)) {
            tags.push(tag);
            systemTile.setTags(tags);
          }
        }
      }
    }

    const container: GameObject = TI4.spawn.spawnOrThrow(
      "container:base/systems"
    );
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
