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

    const planetsAndBase: LayoutObjects = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .add(planetMat)
      .add(baseMat)
      .addAfterLayout(() => {
        planetMat.setObjectType(ObjectType.Ground);
        baseMat.setObjectType(ObjectType.Ground);
      });

    this._layout
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true)
      .add(explorationMat)
      .add(planetsAndBase)
      .add(factionReferenceMat)
      .addAfterLayout(() => {
        explorationMat.setObjectType(ObjectType.Ground);
        factionReferenceMat.setObjectType(ObjectType.Ground);
      });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
