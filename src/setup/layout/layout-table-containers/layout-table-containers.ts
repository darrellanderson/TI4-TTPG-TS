import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { LayoutSystemContainer } from "./layout-system-container";
import { LayoutExplorationContainer } from "./layout-exploration-container";
import { LayoutFrontierContainer } from "./layout-frontier-container";

/**
 * Misc containers.
 */
export class LayoutTableContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true);

    const deletedItems: GameObject = Spawn.spawnOrThrow(
      "container:base/deleted-items",
    );
    const purgedItems: GameObject = Spawn.spawnOrThrow("container:base/purged");

    this._layout
      .add(new LayoutFrontierContainer().getLayout())
      .add(new LayoutSystemContainer().getLayout())
      .add(new LayoutExplorationContainer().getLayout())
      .add(purgedItems)
      .add(deletedItems);

    this._layout.addAfterLayout(() => {
      deletedItems.setObjectType(ObjectType.Ground);
      purgedItems.setObjectType(ObjectType.Ground);
    });
  }

  public getLayout() {
    return this._layout;
  }
}
