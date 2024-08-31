import { Color, GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutConfig } from "../layout-config";
import { ColorLib, ColorsType, LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutTokenContainers {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    const colorLib: ColorLib = new ColorLib();
    const colorsType: ColorsType =
      colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
    const objColor: Color = colorLib.parseColorOrThrow(colorsType.plastic);

    const commandTokenContainer: GameObject = Spawn.spawnOrThrow(
      "container.token.command:base/generic"
    );
    const controlTokenContainer: GameObject = Spawn.spawnOrThrow(
      "container.token.control:base/generic"
    );

    commandTokenContainer.setOwningPlayerSlot(playerSlot);
    commandTokenContainer.setPrimaryColor(objColor);
    commandTokenContainer.setRotation([0, 0, 180]); // floating ui when flipped

    controlTokenContainer.setOwningPlayerSlot(playerSlot);
    controlTokenContainer.setPrimaryColor(objColor);
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
