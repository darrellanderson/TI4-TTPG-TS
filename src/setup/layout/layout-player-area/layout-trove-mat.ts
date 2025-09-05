import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";

export class LayoutTroveMat {
  private readonly _layout: LayoutObjects;

  constructor(playerSlot: number) {
    if (playerSlot < 0) {
      throw new Error("must have a player slot");
    }

    const troveMat: GameObject = TI4.spawn.spawnOrThrow(
      "mat.player:base/trove"
    );

    troveMat.setOwningPlayerSlot(playerSlot);

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .add(troveMat);

    this._layout.addAfterLayout(() => {
      troveMat.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
