import { GameObject } from "@tabletop-playground/api";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { AnimDelay } from "_how-to/anim-lib/anim-delay";
import { Find } from "ttpg-darrell";

export class AnimMidTable {
  _getObj(nsid: string): GameObject {
    const skipContained: boolean = true;
    const obj: GameObject | undefined = new Find().findGameObject(
      nsid,
      undefined,
      skipContained
    );
    if (!obj) {
      const msg: string = `Object with NSID ${nsid} not found`;
      console.error(msg);
      throw new Error(msg);
    }
    return obj;
  }

  async tour(): Promise<void> {
    const z: number = AnimCamera.CAMERA_Z;

    let obj: GameObject;

    obj = this._getObj("tile.system:base/18");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat:base/strategy-card");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat:base/combat-arena");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat.deck:base/base");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);

    obj = this._getObj("mat:base/objective-2");
    await AnimCamera.simpleObj(obj, z);
    await AnimDelay.simple(1000);
  }
}
