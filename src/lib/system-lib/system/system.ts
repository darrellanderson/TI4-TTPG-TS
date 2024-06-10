import { GameObject, Vector, world } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { SystemAttachmentSchemaType } from "../schema/system-attachment-schema";

export class System {
  private readonly _systemSchema: SystemSchemaType;
  private readonly _systemAttachmentSchemas: Array<SystemAttachmentSchemaType> =
    [];
  private _systemTileObjId: string | undefined = undefined;

  constructor(systemSchema: SystemSchemaType) {
    this._systemSchema = systemSchema;
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

  setSystemTileObjId(systemObjId: string | undefined): this {
    this._systemTileObjId = systemObjId;
    return this;
  }
}
