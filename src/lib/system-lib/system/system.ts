import { GameObject, Vector, world } from "@tabletop-playground/api";
import { SystemEntity } from "../system-entity/system-entity";

export class System {
  private readonly _primeSystemEntity: SystemEntity;
  private _systemTileObjId: string | undefined = undefined;

  constructor(systemEntity: SystemEntity) {
    this._primeSystemEntity = systemEntity;
  }

  /**
   * Get the position of the entity in world coordinates.
   * Undefined if no system tile object.
   *
   * @returns
   */
  getGlobalPosition(localPosition: Vector): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const globalPosition: Vector =
      systemTileObj.localPositionToWorld(localPosition);
    return globalPosition;
  }

  getSystemTileObj(): GameObject | undefined {
    if (!this._systemTileObjId) {
      return undefined;
    }
    const systemTileObj: GameObject | undefined = world.getObjectById(
      this._systemTileObjId
    );
    if (!systemTileObj || !systemTileObj.isValid()) {
      return undefined;
    }
    return systemTileObj;
  }

  getSystemTileObjId(): string | undefined {
    return this._systemTileObjId;
  }

  setSystemTileObjId(systemObjId: string): this {
    this._systemTileObjId = systemObjId;
    return this;
  }
}
