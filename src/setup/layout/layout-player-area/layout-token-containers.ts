import {
  Color,
  Container,
  GameObject,
  ObjectType,
} from "@tabletop-playground/api";
import { ColorLib, ColorsType, LayoutObjects } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";
import { LayoutTradegoodContainers } from "../layout-fighter-inf-tg-containers/layout-tradegood-containers";

export class LayoutTokenContainers {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(false);

    const colorLib: ColorLib = new ColorLib();
    const colorsType: ColorsType =
      colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
    const objColor: Color = colorLib.parseColorOrThrow(colorsType.plastic);

    const factionExtrasContainer: GameObject = TI4.spawn.spawnOrThrow(
      "container:base/faction-extras"
    );

    factionExtrasContainer.setOwningPlayerSlot(playerSlot);
    factionExtrasContainer.setPrimaryColor(objColor);
    factionExtrasContainer.setRotation([0, 0, 180]);

    const commandTokenContainer: GameObject = TI4.spawn.spawnOrThrow(
      "container.token.command:base/generic"
    );
    const controlTokenContainer: GameObject = TI4.spawn.spawnOrThrow(
      "container.token.control:base/generic"
    );

    commandTokenContainer.setOwningPlayerSlot(playerSlot);
    commandTokenContainer.setPrimaryColor(objColor);
    commandTokenContainer.setRotation([0, 0, 180]); // floating ui when flipped

    controlTokenContainer.setOwningPlayerSlot(playerSlot);
    controlTokenContainer.setPrimaryColor(objColor);
    controlTokenContainer.setRotation([0, 0, 180]);

    let tags: Array<string>;
    const commandTokenTag: string = `command(${playerSlot})`;
    if (commandTokenContainer instanceof Container) {
      tags = commandTokenContainer.getContainerTags();
      if (!tags.includes(commandTokenTag)) {
        tags.push(commandTokenTag);
        commandTokenContainer.setContainerTags(tags);
      }
    }
    const controlTokenTag: string = `control(${playerSlot})`;
    if (controlTokenContainer instanceof Container) {
      tags = controlTokenContainer.getContainerTags();
      if (!tags.includes(controlTokenTag)) {
        tags.push(controlTokenTag);
        controlTokenContainer.setContainerTags(tags);
      }
      controlTokenContainer.setType(1);
    }

    const col1 = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .add(commandTokenContainer)
      .add(controlTokenContainer);
    const col2 = new LayoutTradegoodContainers()
      .getLayout()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true);

    const lower: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .add(col1)
      .add(col2)
      .addAfterLayout(() => {
        commandTokenContainer.setObjectType(ObjectType.Ground);
        controlTokenContainer.setObjectType(ObjectType.Ground);
      });

    this._layout
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(factionExtrasContainer)
      .add(lower)
      .addAfterLayout(() => {
        factionExtrasContainer.setObjectType(ObjectType.Ground);
      });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
