import {
  Color,
  GameObject,
  ObjectType,
  Vector,
} from "@tabletop-playground/api";
import { ColorLib, ColorsType, LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutSheets {
  private readonly _layout: LayoutObjects = new LayoutObjects();

  constructor(playerSlot: number) {
    const colorLib: ColorLib = new ColorLib();
    const colorsType: ColorsType =
      colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
    const objColor: Color = colorLib.parseColorOrThrow(colorsType.plastic);

    const leaderSheet: GameObject = Spawn.spawnOrThrow("sheet:pok/leader");
    const factionSheet: GameObject = Spawn.spawnOrThrow(
      "sheet.faction:base/generic",
    );
    const commandSheet: GameObject = Spawn.spawnOrThrow("sheet:base/command");

    leaderSheet.setOwningPlayerSlot(playerSlot);
    leaderSheet.setPrimaryColor(objColor);
    commandSheet.setOwningPlayerSlot(playerSlot);
    commandSheet.setPrimaryColor(objColor);

    const leaderLayout: LayoutObjects = new LayoutObjects().add(leaderSheet);

    this._layout
      .setChildDistance(-6)
      .add(leaderLayout)
      .add(factionSheet)
      .add(commandSheet);

    this._layout.addAfterLayout(() => {
      const pos: Vector = factionSheet.getPosition();
      const above: Vector = pos.add(new Vector(0, 0, 1));
      factionSheet.setPosition(above);

      leaderSheet.snapToGround();
      factionSheet.snapToGround();
      commandSheet.snapToGround();

      leaderSheet.setObjectType(ObjectType.Ground);
      factionSheet.setObjectType(ObjectType.Ground);
      commandSheet.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
