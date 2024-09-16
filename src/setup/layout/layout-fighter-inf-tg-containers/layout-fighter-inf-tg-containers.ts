import { LayoutObjects, Spawn } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutFighterContainers } from "./layout-fighter-containers";
import { LayoutInfantryContainers } from "./layout-infantry-containers";
import { LayoutTradegoodContainers } from "./layout-tradegood-containers";

export class LayoutFighterInfTgContainers {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacingWide)
      .setIsVertical(true);

    const topGarbage: GameObject = Spawn.spawnOrThrow("container:base/garbage");
    const bottompGarbage: GameObject = Spawn.spawnOrThrow(
      "container:base/garbage"
    );

    this._layout
      .add(topGarbage)
      .add(new LayoutFighterContainers().getLayout())
      .add(new LayoutInfantryContainers().getLayout())
      .add(new LayoutTradegoodContainers().getLayout())
      .add(bottompGarbage);

    this._layout.addAfterLayout(() => {
      topGarbage.setObjectType(ObjectType.Ground);
      bottompGarbage.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
