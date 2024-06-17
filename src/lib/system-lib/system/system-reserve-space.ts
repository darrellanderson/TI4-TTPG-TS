import { GameObject, Vector, world } from "@tabletop-playground/api";

/**
 * Lift and drop objects over a system tile.
 * Used to reserve space for system/planet attachments.
 */
export class SystemReserveSpace {
  private readonly _systemTileObj: GameObject;
  private _liftedObjs: Array<GameObject> = [];

  constructor(systemTileObj: GameObject) {
    this._systemTileObj = systemTileObj;
  }

  lift(): this {
    // Lift everything (except the system tile) in the area.
    // Sort by z position (bottom to top).
    const pos: Vector = this._systemTileObj.getPosition();
    const extent: Vector = this._systemTileObj.getExtent(true, false);
    extent.z = 10;
    this._liftedObjs = world
      .boxOverlap(pos, extent)
      .filter((obj) => obj !== this._systemTileObj)
      .sort((a, b) => a.getPosition().z - b.getPosition().z);

    for (const obj of this._liftedObjs) {
      const above = obj.getPosition().add(new Vector(0, 0, 5));
      obj.setPosition(above);
    }

    return this;
  }

  drop(): this {
    // Drop everything lifted (in bottom to top order).
    for (const obj of this._liftedObjs) {
      obj.snapToGround();
    }
    this._liftedObjs = [];
    return this;
  }
}
