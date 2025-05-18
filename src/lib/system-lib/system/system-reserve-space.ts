import {
  GameObject,
  ObjectType,
  Vector,
  world,
} from "@tabletop-playground/api";
import { HexType, NSID } from "ttpg-darrell";

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
    const hex: HexType = TI4.hex.fromPosition(pos);
    const extent: Vector = this._systemTileObj.getExtent(true, false);
    extent.z = 10;
    this._liftedObjs = world
      .boxOverlap(pos, extent)
      .filter((obj: GameObject): boolean => {
        const nsid: string = NSID.get(obj);
        const objPos: Vector = obj.getPosition();
        const objHex: HexType = TI4.hex.fromPosition(objPos);
        return !nsid.startsWith("tile.system:") && objHex === hex;
      })
      .sort((a, b) => a.getPosition().z - b.getPosition().z);

    for (const obj of this._liftedObjs) {
      const above = obj.getPosition().add(new Vector(0, 0, 5));
      obj.setObjectType(ObjectType.Regular);
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
