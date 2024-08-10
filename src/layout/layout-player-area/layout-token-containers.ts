import { GameObject } from "@tabletop-playground/api";
import { LayoutConfig } from "../layout-config";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutTokenContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    const commandTokenContainer: GameObject = Spawn.spawnOrThrow(
      "container.token.command:base/generic"
    );
    const controlTokenContainer: GameObject = Spawn.spawnOrThrow(
      "container.token.control:base/generic"
    );

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .add(commandTokenContainer)
      .add(controlTokenContainer);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
