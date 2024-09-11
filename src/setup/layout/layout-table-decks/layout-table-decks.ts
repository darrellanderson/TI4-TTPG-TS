import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";

export class LayoutTableDecks {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const baseMat: GameObject = Spawn.spawnOrThrow("mat.deck:base/base");
    const explorationMat: GameObject = Spawn.spawnOrThrow(
      "mat.deck:pok/exploration"
    );
    const factionReferenceMat: GameObject = Spawn.spawnOrThrow(
      "mat.deck:base/faction-reference"
    );
    const planetMat: GameObject = Spawn.spawnOrThrow("mat.deck:base/planet");

    this._layout
      .setChildDistance(LayoutConfig.spacingWide)
      .add(baseMat)
      .add(planetMat)
      .add(explorationMat)
      .add(factionReferenceMat)
      .addAfterLayout(() => {
        baseMat.setObjectType(ObjectType.Ground);
        explorationMat.setObjectType(ObjectType.Ground);
        factionReferenceMat.setObjectType(ObjectType.Ground);
        planetMat.setObjectType(ObjectType.Ground);
      });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
