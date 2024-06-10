import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { Planet } from "../planet/planet";
import { SystemAttachmentSchemaType } from "../schema/system-attachment-schema";
import { WormholeWithGlobalPosition } from "../system/system";

export class SystemAttachment {
  private readonly _params: SystemAttachmentSchemaType;
  private readonly _planets: Array<Planet> = [];
  private _attachmentObjId: string | undefined;

  constructor(params: SystemAttachmentSchemaType) {
    this._params = params;
    if (params.planets) {
      this._planets = params.planets.map((planet) => new Planet(planet));
    }
    Object.freeze(this._planets);
  }

  getAnomalies(): Array<string> {
    return this._params.anomalies || [];
  }

  getAttachmentObj(): GameObject | undefined {
    if (!this._attachmentObjId) {
      return undefined;
    }
    const obj: GameObject | undefined = world.getObjectById(
      this._attachmentObjId
    );
    if (!obj || !obj.isValid()) {
      return undefined;
    }
    return obj;
  }

  getImg(): string | undefined {
    let result: string | undefined = this._params.img;
    if (result && this._params.imgPackageId) {
      result = `${result}:${this._params.imgPackageId}`;
    }
    return result;
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): string {
    return this._params.nsid;
  }

  getPlanets(): Array<Planet> {
    return this._planets;
  }

  getWormholes(): Array<string> {
    if (this._params.wormholesFaceDown && !this.isAttachmentFaceUp()) {
      return this._params.wormholesFaceDown;
    }
    return this._params.wormholes || [];
  }

  getWormholesWithGlobalPositions(): Array<WormholeWithGlobalPosition> {
    const result: Array<WormholeWithGlobalPosition> = [];

    const attachmentObj: GameObject | undefined = this.getAttachmentObj();
    if (!attachmentObj) {
      return result;
    }

    const globalPosition: Vector = attachmentObj.getPosition();

    for (const wormhole of this.getWormholes()) {
      result.push({
        globalPosition,
        wormhole,
      });
    }

    return result;
  }

  isAttachmentFaceUp(): boolean {
    const obj: GameObject | undefined = this.getAttachmentObj();
    if (!obj) {
      return true;
    }
    return Facing.isFaceUp(obj);
  }

  setAttachmentObjId(objId: string | undefined): this {
    this._attachmentObjId = objId;
    return this;
  }
}
