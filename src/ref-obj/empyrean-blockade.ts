import {
  GameObject,
  Player,
  refObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Hex, HexType } from "ttpg-darrell";

class EmpyreanBlockade {
  private readonly _obj: GameObject;

  private readonly _onReleased = (
    _object: GameObject,
    _player: Player,
    _thrown: boolean,
    _grabPosition: Vector | [x: number, y: number, z: number],
    _grabRotation: Rotator | [pitch: number, yaw: number, roll: number]
  ): void => {
    const pos: Vector = this._obj.getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);
    const adjHex: HexType | undefined = this._closestAdjHex(hex);
    if (!adjHex) {
      return;
    }
    const midpoint: Vector = this._midpoint(hex, adjHex);
    midpoint.z = world.getTableHeight() + 10;
    const rotation: Rotator = this._edgeRotation(hex, adjHex);
    this._obj.setPosition(midpoint);
    this._obj.setRotation(rotation);
    this._obj.snapToGround();
  };

  constructor(obj: GameObject) {
    this._obj = obj;
    this._obj.onReleased.add(this._onReleased);
  }

  _closestAdjHex(hex: HexType): HexType | undefined {
    const pos: Vector = this._obj.getPosition();
    const neighbors: Array<HexType> = Hex.neighbors(hex);
    let best: HexType | undefined;
    let bestDSq: number = Infinity;
    for (const neighbor of neighbors) {
      const neighborPos: Vector = TI4.hex.toPosition(neighbor);
      const dSq: number = pos.subtract(neighborPos).magnitudeSquared();
      if (dSq < bestDSq) {
        best = neighbor;
        bestDSq = dSq;
      }
    }
    return best;
  }

  _midpoint(hex1: HexType, hex2: HexType): Vector {
    const pos1: Vector = TI4.hex.toPosition(hex1);
    const pos2: Vector = TI4.hex.toPosition(hex2);
    return pos1.add(pos2).multiply(0.5);
  }

  _edgeRotation(hex1: HexType, hex2: HexType): Rotator {
    const pos1: Vector = TI4.hex.toPosition(hex1);
    const pos2: Vector = TI4.hex.toPosition(hex2);
    const delta: Vector = pos2.subtract(pos1);
    const angle: number = Math.atan2(delta.y, delta.x);
    return new Rotator(0, (angle * 180) / Math.PI, 0);
  }
}

new EmpyreanBlockade(refObject);
