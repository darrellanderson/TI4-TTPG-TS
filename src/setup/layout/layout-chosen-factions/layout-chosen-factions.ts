import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

export class LayoutChosenFactions {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const mat: GameObject = TI4.spawn.spawnOrThrow("mat:base/chosen-faction");

    this._layout.add(mat);
    this._layout.addAfterLayout(() => {
      mat.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
