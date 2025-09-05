import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

export class LayoutTimer {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const timer: GameObject = TI4.spawn.spawnOrThrow("mat:base/timer");

    this._layout.add(timer).addAfterLayout(() => {
      timer.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
