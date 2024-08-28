import { GameObject, ObjectType } from "@tabletop-playground/api";
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

    // Image flat on top of box, flip for floating UI instead.
    commandTokenContainer.setRotation([0, 0, 180]);
    controlTokenContainer.setRotation([0, 0, 180]);

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .add(commandTokenContainer)
      .add(controlTokenContainer);

    this._layout.addAfterLayout(() => {
      commandTokenContainer.setObjectType(ObjectType.Ground);
      controlTokenContainer.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
