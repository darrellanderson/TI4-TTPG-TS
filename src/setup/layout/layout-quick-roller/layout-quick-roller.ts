import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutQuickRoller {
  private readonly _layout: LayoutObjects;

  constructor() {
    this._layout = new LayoutObjects();

    const quickRoller: GameObject = Spawn.spawnOrThrow(
      "quick-roller:base/quick-roller"
    );

    this._layout.add(quickRoller).addAfterLayout(() => {
      quickRoller.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
