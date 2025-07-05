import { GameObject, Vector } from "@tabletop-playground/api";
import { AnimCamera } from "_how-to/anim-lib/anim-camera";
import { Find } from "ttpg-darrell";

export class AnimMidTable {
  private readonly _find: Find = new Find();
  private readonly _center: Vector;

  constructor() {
    this._center = new Vector(0, 0, AnimCamera.CAMERA_Z);
  }

  toCenter(): Promise<void> {
    return AnimCamera.simple(this._center);
  }

  toObj(nsid: string): Promise<void> {
    const skipContained: boolean = true;
    const obj: GameObject | undefined = this._find.findGameObject(
      nsid,
      undefined,
      skipContained
    );
    if (!obj) {
      throw new Error(`Object with NSID ${nsid} not found`);
    }
    const pos: Vector = obj.getPosition();
    pos.z = AnimCamera.CAMERA_Z;
    return AnimCamera.simple(pos);
  }

  async tour(): Promise<void> {
    return this.toObj("sheet.faction:base/generic")
      .then(() => AnimCamera.simple(this._center))
      .then(() => this.toObj("mat:base/status-pad"))
      .then(() => AnimCamera.simple(this._center))
      .then(() => this.toObj("mat.player:base/build"))
      .then(() => AnimCamera.simple(this._center))
      .then(() => this.toObj("mat.player:base/planet"))
      .then(() => AnimCamera.simple(this._center))
      .then(() => this.toObj("mat.player:base/technology"));
  }
}
