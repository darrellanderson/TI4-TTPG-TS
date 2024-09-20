import { Color, GameObject, ObjectType } from "@tabletop-playground/api";
import { ColorLib, ColorsType, LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutStatusPad {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    this._layout = new LayoutObjects();

    const statusPad: GameObject = Spawn.spawnOrThrow("mat:base/status-pad");
    statusPad.setOwningPlayerSlot(playerSlot);

    const colorLib: ColorLib = new ColorLib();
    const colorsType: ColorsType =
      colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
    const color: Color = colorLib.parseColorOrThrow(colorsType.plastic);
    statusPad.setPrimaryColor(color);

    this._layout.add(statusPad).addAfterLayout(() => {
      statusPad.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
