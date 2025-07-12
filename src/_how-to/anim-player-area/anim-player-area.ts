import { GameObject } from "@tabletop-playground/api";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { AnimDelay } from "_how-to/anim-lib/anim-delay";
import { AnimHighlight } from "_how-to/anim-lib/anim-highlight";
import { Find, PlayerSlot } from "ttpg-darrell";

export class AnimPlayerArea {
  private readonly _find: Find = new Find();
  private readonly _playerSlot: PlayerSlot;

  constructor(playerSlot: PlayerSlot) {
    this._playerSlot = playerSlot;
  }

  _getObj(nsid: string): GameObject {
    const skipContained: boolean = true;
    const obj: GameObject | undefined = new Find().findGameObject(
      nsid,
      this._playerSlot,
      skipContained
    );
    if (!obj) {
      const msg: string = `Object with NSID ${nsid} not found`;
      console.error(msg);
      throw new Error(msg);
    }
    return obj;
  }

  async fullTour(): Promise<void> {
    const z: number = AnimCamera.CAMERA_Z;
    let obj: GameObject;

    obj = this._getObj("sheet.faction:base/generic");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat.player:base/build");
    await AnimCamera.simpleObj(obj, z);
    AnimHighlight.simple(obj, 1000);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat.player:base/planet");
    await AnimCamera.simpleObj(obj, z);
    AnimHighlight.simple(obj, 1000);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat.player:base/technology");
    await AnimCamera.simpleObj(obj, z);
    AnimHighlight.simple(obj, 1000);
    await AnimDelay.simple(1000);
  }

  async miniTour(): Promise<void> {
    const z: number = AnimCamera.CAMERA_Z;

    const obj: GameObject = this._getObj("sheet.faction:base/generic");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);
  }
}
