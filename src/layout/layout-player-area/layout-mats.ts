import { VerticalAlignment } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";

export class LayoutMats {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setVerticalAlignment(VerticalAlignment.Top)
      .add(Spawn.spawnOrThrow("mat.player:base/build"))
      .add(Spawn.spawnOrThrow("mat.player:base/planet"))
      .add(Spawn.spawnOrThrow("mat.player:base/technology"));
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
