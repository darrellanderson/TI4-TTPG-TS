import {
  GameObject,
  Vector,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { PlanetAttachmentSchemaType } from "../schema/planet-attachment-schema";

export class PlanetAttachment {
  private readonly _params: PlanetAttachmentSchemaType;
  private _attachmentObjId: string | undefined;

  constructor(params: PlanetAttachmentSchemaType) {
    this._params = params;
    Object.freeze(this._params);
  }

  public getAttachmentObj(): GameObject | undefined {
    if (this._attachmentObjId === undefined) {
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

  public getAttachmentObjId(): string | undefined {
    return this._attachmentObjId;
  }

  public getInfluence(): number {
    if (
      this._params.influenceFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      return this._params.influenceFaceDown;
    }
    return this._params.influence ?? 0;
  }

  getLegendaryCardNsid(): string | undefined {
    return this._params.legendaryCardNsid;
  }

  public getName(): string {
    return this._params.name;
  }

  public getNsid(): string {
    return this._params.nsid;
  }

  public getResources(): number {
    if (
      this._params.resourcesFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      return this._params.resourcesFaceDown;
    }
    return this._params.resources ?? 0;
  }

  public getTechs(): Array<string> {
    const result: Array<string> = [];
    if (
      this._params.techsFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      result.push(...this._params.techsFaceDown);
    } else if (this._params.techs) {
      result.push(...this._params.techs);
    }
    return result;
  }

  public getTraits(): Array<string> {
    const result: Array<string> = [];
    if (
      this._params.traitsFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      result.push(...this._params.traitsFaceDown);
    } else if (this._params.traits) {
      result.push(...this._params.traits);
    }
    return result;
  }

  public isAttachmentFaceUp(): boolean {
    const obj = this.getAttachmentObj();
    if (!obj) {
      return true;
    }
    return Facing.isFaceUp(obj);
  }

  public isDestroyPlanet(): boolean {
    return this._params.isDestroyPlanet ?? false;
  }

  public isLegendary(): boolean {
    return this._params.isLegendary ?? false;
  }

  public setAttachmentObjId(objId: string | undefined): this {
    this._attachmentObjId = objId;
    return this;
  }
}
