import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutCombatArena {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const arena: GameObject = Spawn.spawnOrThrow("mat:base/combat-arena");

    this._layout.add(arena);

    this._layout.addAfterLayout(() => {
      arena.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
