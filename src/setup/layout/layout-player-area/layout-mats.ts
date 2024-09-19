import {
  GameObject,
  ObjectType,
  VerticalAlignment,
} from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

import { LayoutConfig } from "../layout-config";

export class LayoutMats {
  private readonly _layout: LayoutObjects;

  constructor() {
    const buildMat: GameObject = Spawn.spawnOrThrow("mat.player:base/build");
    const planetMat: GameObject = Spawn.spawnOrThrow("mat.player:base/planet");
    const techMat: GameObject = Spawn.spawnOrThrow(
      "mat.player:base/technology"
    );
    const techDeckMat: GameObject = Spawn.spawnOrThrow(
      "mat.player:base/technology-deck"
    );

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setVerticalAlignment(VerticalAlignment.Top)
      .add(buildMat)
      .add(planetMat)
      .add(techMat)
      .add(techDeckMat);

    this._layout.addAfterLayout(() => {
      buildMat.setObjectType(ObjectType.Ground);
      planetMat.setObjectType(ObjectType.Ground);
      techMat.setObjectType(ObjectType.Ground);
      techDeckMat.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
