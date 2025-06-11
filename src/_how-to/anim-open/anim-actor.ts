import { Color, GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { Spawn } from "ttpg-darrell";

export type AnimActorParams = {
  nsid: string;
  scale: number;
  color: Color;
  p0: Vector;
  p1: Vector;
  speed: number;
};

export class AnimActor {
  private readonly _params: AnimActorParams;
  private readonly _obj: GameObject;

  private readonly _onTick = (obj: GameObject, deltaMsecs: number): void => {
    const srcPos: Vector = obj.getPosition();
    const dstPos: Vector = Vector.interpolateToConstant(
      srcPos,
      this._params.p1,
      deltaMsecs,
      this._params.speed
    );
    obj.setPosition(dstPos);

    if (srcPos.distance(dstPos) < 0.01) {
      obj.onTick.remove(this._onTick);
      obj.destroy();
    }
  };

  constructor(params: AnimActorParams) {
    this._params = params;

    const rot: Rotator = params.p1.findLookAtRotation(params.p0);
    this._obj = Spawn.spawnOrThrow(params.nsid, params.p0, rot);
    this._obj.setScale(new Vector(1, 1, 1).multiply(params.scale));
    this._obj.setPrimaryColor(params.color);
    this._obj.setPosition(params.p0);
    this._obj.toggleLock();

    this._obj.setTags(["_deleted_items_ignore_"]);
    this._obj.onTick.add(this._onTick);
  }

  getObj(): GameObject {
    return this._obj;
  }
}
