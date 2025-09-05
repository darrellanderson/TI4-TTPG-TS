import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";

export class LayoutAgendaLawsMat {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects().setChildDistance(
      LayoutConfig.spacingWide
    );

    const mat: GameObject = TI4.spawn.spawnOrThrow("mat:base/agenda-laws");
    const custodiansMat: GameObject = TI4.spawn.spawnOrThrow(
      "mat:base/custodians"
    );

    this._layout
      .add(mat)
      .add(custodiansMat)
      .addAfterLayout(() => {
        mat.setObjectType(ObjectType.Ground);
        custodiansMat.setObjectType(ObjectType.Ground);
      });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
