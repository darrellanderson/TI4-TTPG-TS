import { Color, GameObject, Rotator, Vector } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";

export type AnimActorParams = {
  nsid: string;
  scale: number;
  color: Color;
  p0: Vector;
  p1: Vector;
  speed: number;
};

/**
 * Animate a game object.
 */
export class AnimActor {
  public readonly onDestroyed: TriggerableMulticastDelegate<() => void> =
    new TriggerableMulticastDelegate<() => void>();

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
      this.destroy();
    }
  };

  constructor(params: AnimActorParams) {
    this._params = params;

    const rot: Rotator = this._params.p1.findLookAtRotation(params.p0);
    this._obj = TI4.spawn.spawnOrThrow(params.nsid, params.p0, rot);
    this._obj.setScale(new Vector(1, 1, 1).multiply(params.scale));
    this._obj.setPrimaryColor(params.color);
    this._obj.setPosition(params.p0);
    this._obj.toggleLock();
    this._obj.setTags(["_deleted_items_ignore_"]);
    this._obj.onTick.add(this._onTick);
  }

  destroy(): void {
    this._obj.onTick.remove(this._onTick);
    if (this._obj.isValid()) {
      this._obj.destroy();
      process.nextTick(() => {
        this.onDestroyed.trigger();
      });
    }
  }

  getObj(): GameObject {
    return this._obj;
  }
}
