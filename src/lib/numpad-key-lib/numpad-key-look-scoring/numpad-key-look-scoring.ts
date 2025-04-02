// 7
import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class NumpadKeyLookScoring {
  private readonly _find: Find = new Find();
  private readonly _key: number;

  private readonly _onScriptButtonPressed = (
    player: Player,
    index: number,
    ctrl: boolean,
    alt: boolean
  ): void => {
    // Our key?
    if (index !== this._key || ctrl || alt) {
      return;
    }

    const skipContained: boolean = true;
    const obj: GameObject | undefined = this._find.findGameObject(
      "token:base/scoreboard",
      undefined,
      skipContained
    );
    if (!obj) {
      return;
    }

    const lookAt: Vector = obj.getPosition().add([-13, 0, 0]);
    lookAt.z = world.getTableHeight();
    const lookFrom: Vector = lookAt.add([-10, 0, 60]);
    const rot = lookFrom.findLookAtRotation(lookAt);
    player.setPositionAndRotation(lookFrom, rot);
  };

  constructor(key: number) {
    this._key = key;
    globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
  }

  destroy(): void {
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
  }
}
