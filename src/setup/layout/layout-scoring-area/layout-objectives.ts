import { GameObject, ObjectType } from "@tabletop-playground/api";
import { LayoutObjects, Spawn } from "ttpg-darrell";
import { LayoutConfig } from "../layout-config";

export class LayoutObjectives {
  private readonly _layout: LayoutObjects;
  private readonly _scoreboard: GameObject;

  constructor() {
    const objectivesMat1: GameObject = Spawn.spawnOrThrow(
      "mat:base/objective-1",
    );
    this._scoreboard = Spawn.spawnOrThrow("token:base/scoreboard");
    const objectivesMat2: GameObject = Spawn.spawnOrThrow(
      "mat:base/objective-2",
    );

    this._layout = new LayoutObjects()
      .setChildDistance(LayoutConfig.spacing)
      .setIsVertical(true)
      .add(objectivesMat1)
      .add(this._scoreboard)
      .add(objectivesMat2);

    this._layout.addAfterLayout(() => {
      objectivesMat1.setObjectType(ObjectType.Ground);
      this._scoreboard.setObjectType(ObjectType.Ground);
      objectivesMat2.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }

  getScoreboard(): GameObject {
    return this._scoreboard;
  }
}
