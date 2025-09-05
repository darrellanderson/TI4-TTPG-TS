import { LayoutObjects } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";
import { GameObject, ObjectType } from "@tabletop-playground/api";

export class LayoutPlayerSecrets {
  private readonly _layout: LayoutObjects;

  constructor(playerCount: number) {
    const secrets1: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacing
    );
    const secrets2: LayoutObjects = new LayoutObjects().setChildDistance(
      LayoutConfig.spacing
    );

    const secretsArray: Array<GameObject> = [];
    const topCount: number = Math.floor(playerCount / 2);
    for (let i = 0; i < playerCount; i++) {
      const secrets: GameObject = TI4.spawn.spawnOrThrow(
        "card-holder:base/player-scoring"
      );
      secrets.setOwningPlayerSlot(10 + i);
      const whichLayout: LayoutObjects = i < topCount ? secrets1 : secrets2;
      whichLayout.add(secrets);
      secretsArray.push(secrets);
    }

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .add(secrets1)
      .add(secrets2);

    this._layout.addAfterLayout(() => {
      secretsArray.forEach((secrets) => {
        secrets.setObjectType(ObjectType.Ground);
      });
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
