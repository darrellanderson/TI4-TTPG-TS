import { GameObject, Vector } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutSheets {
  private readonly _layout: LayoutObjects = new LayoutObjects();

  constructor() {
    const leaderSheet: GameObject = Spawn.spawnOrThrow("sheet:pok/leader");
    const factionSheet: GameObject = Spawn.spawnOrThrow(
      "faction-sheet:base/generic"
    );
    const commandSheet: GameObject = Spawn.spawnOrThrow("sheet:base/command");

    this._layout
      .setChildDistance(-5)
      .add(leaderSheet)
      .add(factionSheet)
      .add(commandSheet);

    this._layout.addAfterLayout(() => {
      const pos: Vector = factionSheet.getPosition();
      const above: Vector = pos.add(new Vector(0, 0, 1));
      factionSheet.setPosition(above);
      factionSheet.snapToGround();
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
