import { GameObject, Vector, world } from "@tabletop-playground/api";
import { SystemEntityType } from "./system-entity-schema";

/**
 * Something linked to a system, e.g. a wormhole, anomaly, planet, etc.
 * Could be intrisic to the system tile, or an attachment/token.
 */
export class SystemEntity {
  private readonly _name: string = "";
  private readonly _nsid: string | undefined = undefined;
  private readonly _type: string = "";

  private _localPosition: Vector = new Vector(0, 0, 0);
  private _systemTileObjId: string | undefined = undefined;

  constructor(params: SystemEntityType) {
    this._name = params.name;
    this._nsid = params.nsid;
    this._type = params.type;
    if (params.position) {
      this._localPosition = new Vector(params.position.x, params.position.y, 0);
    }
  }

  /**
   * Get the position of the entity in world coordinates.
   * Undefined if no system tile object.
   *
   * @returns
   */
  getGlobalPosition(): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const globalPosition: Vector = systemTileObj.localPositionToWorld(
      this._localPosition
    );
    return globalPosition;
  }

  getLocalPosition(): Vector {
    return this._localPosition.clone();
  }

  getName(): string {
    return this._name;
  }

  getNSID(): string | undefined {
    return this._nsid;
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

  getType(): string {
    return this._type;
  }

  setLocalPosition(localPosition: Vector): this {
    this._localPosition = localPosition.clone();
    return this;
  }

  setSystemTileObjId(systemObjId: string): this {
    this._systemTileObjId = systemObjId;
    return this;
  }
}
