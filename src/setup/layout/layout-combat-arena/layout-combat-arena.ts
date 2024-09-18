import { GameObject } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutCombatArena {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const arena: GameObject = Spawn.spawnOrThrow("tile.system:base/0");

    this._layout.add(arena);
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
