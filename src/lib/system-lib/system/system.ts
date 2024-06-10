import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { SystemSchemaType } from "../schema/system-schema";
import { Planet } from "../planet/planet";
import { SystemAttachment } from "../system-attachment/system-attachment";

export type WormholeWithGlobalPosition = {
  wormhole: string;
  globalPosition: Vector;
};

export type WormholeWithLocalPosition = {
  wormhole: string;
  localPosition: Vector;
};

export class System {
  private readonly _params: SystemSchemaType;
  private readonly _planets: Array<Planet> = [];
  private readonly _wormholes: Array<WormholeWithLocalPosition> = [];
  private readonly _wormholesFaceDown:
    | Array<WormholeWithLocalPosition>
    | undefined;
  private readonly _attachments: Array<SystemAttachment> = [];
  private _systemTileObjId: string | undefined = undefined;

  constructor(params: SystemSchemaType) {
    this._params = params;
    if (params.planets) {
      this._planets = params.planets.map((planet) => new Planet(planet));
    }
    Object.freeze(this._planets);
    if (params.wormholes) {
      // TODO
    }
    if (params.wormholesWithPositions) {
      for (const wormholeWithPosition of params.wormholesWithPositions) {
        this._wormholes.push({
          wormhole: wormholeWithPosition.wormhole,
          localPosition: new Vector(
            wormholeWithPosition.localPosition.x,
            wormholeWithPosition.localPosition.y,
            0
          ),
        });
      }
    }
    Object.freeze(this._wormholes);
    if (params.wormholesWithPositionsFaceDown) {
      this._wormholesFaceDown = [];
      // TODO

      Object.freeze(this._wormholesFaceDown);
    }
  }

  getAnomalies(): Array<string> {
    const result: Array<string> = [];
    if (this._params.anomalies) {
      result.push(...this._params.anomalies);
    }
    for (const attachment of this._attachments) {
      result.push(...attachment.getAnomalies());
    }
    return result;
  }

  getLocalPosition(globalPosition: Vector): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const localPosition: Vector =
      systemTileObj.worldPositionToLocal(globalPosition);
    return localPosition;
  }

  getGlobalPosition(localPosition: Vector): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const globalPosition: Vector =
      systemTileObj.localPositionToWorld(localPosition);
    return globalPosition;
  }

  getImg(): string | undefined {
    let result: string | undefined = this._params.img;
    if (result && this._params.imgPackageId) {
      result = `${result}:${this._params.imgPackageId}`;
    }
    return result;
  }

  getPlanets(): Array<Planet> {
    const result: Array<Planet> = [];
    result.push(...this._planets);
    for (const attachment of this._attachments) {
      result.push(...attachment.getPlanets());
    }
    return result;
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

  getTile(): number {
    return this._params.tile;
  }

  getWormholes(): Array<string> {
    const result: Array<string> = [];
    for (const wormholeWithLocalPosition of this.getWormholesWithGlobalPositions()) {
      result.push(wormholeWithLocalPosition.wormhole);
    }
    for (const attachment of this._attachments) {
      result.push(...attachment.getWormholes());
    }
    return result;
  }

  getWormholesWithGlobalPositions(): Array<WormholeWithGlobalPosition> {
    const result: Array<WormholeWithGlobalPosition> = [];

    let thisLocalWormholes: Array<WormholeWithLocalPosition> = [];
    if (this._wormholesFaceDown && !this.isSystemFaceUp()) {
      thisLocalWormholes = this._wormholesFaceDown;
    } else {
      thisLocalWormholes = this._wormholes;
    }

    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    for (const localWormhole of thisLocalWormholes) {
      let globalPosition: Vector = new Vector(0, 0, 0);
      if (systemTileObj) {
        globalPosition = systemTileObj.localPositionToWorld(
          localWormhole.localPosition
        );
      }
      result.push({
        wormhole: localWormhole.wormhole,
        globalPosition,
      });

      for (const attachment of this._attachments) {
        result.push(...attachment.getWormholesWithGlobalPositions());
      }
    }
    return result;
  }

  isHome(): boolean {
    return this._params.isHome || false;
  }

  isHyperlane(): boolean {
    return this._params.isHyperlane || false;
  }

  isSystemFaceUp(): boolean {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return true;
    }
    return Facing.isFaceUp(systemTileObj);
  }

  setSystemTileObjId(systemObjId: string | undefined): this {
    this._systemTileObjId = systemObjId;
    return this;
  }
}
