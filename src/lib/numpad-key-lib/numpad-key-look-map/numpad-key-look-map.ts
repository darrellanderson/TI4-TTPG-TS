// 6 (z+110)
import { globalEvents, Player, Vector, world } from "@tabletop-playground/api";

export class NumpadKeyLookMap {
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
    const lookAt: Vector = new Vector(6, 0, world.getTableHeight());
    const lookFrom: Vector = lookAt.add([-10, 0, 135]); // origin look and z 110 not enough for fracture
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
