import { GameObject } from "@tabletop-playground/api";
import { LayoutConfig } from "../layout-config";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutTokenContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    const commandTokenContainer: GameObject = Spawn.spawnOrThrow(
      "container.token:base/command"
    );
    const controlTokenContainer: GameObject = Spawn.spawnOrThrow(
      "container.token:base/command"
    );

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .add(commandTokenContainer)
      .add(controlTokenContainer);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
