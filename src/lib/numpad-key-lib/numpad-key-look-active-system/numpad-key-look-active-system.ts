// 5 (z+20)
import {
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../system-lib/system/system";

export class NumpadKeyLookActiveSystem {
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

    const activeSystem: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (!activeSystem) {
      return;
    }
    const obj: GameObject = activeSystem.getObj();

    const lookAt: Vector = obj.getPosition();
    lookAt.z = world.getTableHeight();
    const lookFrom: Vector = lookAt.add([-10, 0, 20]);
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
