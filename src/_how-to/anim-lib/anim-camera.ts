import {
  GameObject,
  globalEvents,
  Player,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Find, TriggerableMulticastDelegate } from "ttpg-darrell";

export type AnimCameraParams = {
  player: Player;
  p0: Vector;
  p1: Vector;
  r0: Rotator;
  r1: Rotator;
  speed: number; // pos speed, rot is interpolated with pos
};

/**
 * Move the player camera.
 */
export class AnimCamera {
  public readonly onDestroyed: TriggerableMulticastDelegate<() => void> =
    new TriggerableMulticastDelegate<() => void>();

  public static readonly CAMERA_Z: number = 70;

  /**
   * Look at the table-height dspPos from a slight southern position.
   *
   * @param dstPos
   * @returns
   */
  static simple(lookAt: Vector, z: number): Promise<void> {
    const player: Player | undefined = world.getAllPlayers()[0];
    if (!player) {
      throw new Error("No player found");
    }

    const srcPos: Vector = player.getPosition();
    const srcRot: Rotator = player.getRotation();

    lookAt.z = world.getTableHeight();
    const dstPos: Vector = lookAt.add([-10, 0, z]);
    const dstRot: Rotator = dstPos.findLookAtRotation(lookAt);
    const animCamera = new AnimCamera({
      player,
      p0: srcPos,
      p1: dstPos,
      r0: srcRot,
      r1: dstRot,
      speed: 30,
    });

    return new Promise<void>((resolve) => {
      animCamera.onDestroyed.add(() => {
        resolve();
      });
    });
  }

  static simpleObj(nsid: string, z: number): Promise<void> {
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
    const pos: Vector = obj.getPosition();
    return AnimCamera.simple(pos, z);
  }

  private readonly _params: AnimCameraParams;
  private _cameraPos: Vector; // do not rely on player.getPosition()
  private _tickCount: number = 0;

  private readonly _onTick = (deltaMsecs: number): void => {
    this._tickCount += 1;
    if (this._tickCount % 3 !== 0) {
      return; // camera stutters if we do every frame
    }

    this._cameraPos = Vector.interpolateToConstant(
      this._cameraPos,
      this._params.p1,
      deltaMsecs,
      this._params.speed * 3 // b/c skipping frames
    );

    const d: number = this._params.p0.distance(this._cameraPos);
    const tot: number = this._params.p0.distance(this._params.p1);
    const u: number = d / tot;

    const dstRot: Rotator = Rotator.lerp(
      this._params.r0,
      this._params.r1,
      u,
      false
    );

    this._params.player.setPositionAndRotation(this._cameraPos, dstRot);

    if (this._params.p1.distance(this._cameraPos) < 0.01) {
      this.destroy();
    }
  };

  constructor(params: AnimCameraParams) {
    this._params = params;
    this._cameraPos = params.p0;

    globalEvents.onTick.add(this._onTick);
  }

  destroy(): void {
    globalEvents.onTick.remove(this._onTick);
    process.nextTick(() => {
      this.onDestroyed.trigger();
    });
  }
}
