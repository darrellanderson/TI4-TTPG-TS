import { LayoutObjects } from "ttpg-darrell";
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

    const topGarbage: GameObject = TI4.spawn.spawnOrThrow(
      "container:base/garbage",
      undefined,
      [0, 0, 180]
    );
    const bottompGarbage: GameObject = TI4.spawn.spawnOrThrow(
      "container:base/garbage",
      undefined,
      [0, 0, 180]
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
