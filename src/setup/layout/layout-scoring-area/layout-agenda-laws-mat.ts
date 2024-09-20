import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutAgendaLawsMat {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const mat: GameObject = Spawn.spawnOrThrow("mat:base/agenda-laws");

    this._layout.add(mat).addAfterLayout(() => {
      mat.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
