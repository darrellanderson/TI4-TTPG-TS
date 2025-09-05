import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects } from "ttpg-darrell";

export class LayoutQuickRoller {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const quickRoller: GameObject = TI4.spawn.spawnOrThrow(
      "mat:base/quick-roller"
    );

    this._layout.add(quickRoller).addAfterLayout(() => {
      quickRoller.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
